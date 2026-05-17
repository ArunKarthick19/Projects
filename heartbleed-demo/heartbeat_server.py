#!/usr/bin/env python3
from __future__ import annotations

import argparse
import socket
import struct
import threading
from pathlib import Path

BASE_DIR    = Path(__file__).resolve().parent
MEMORY_FILE = BASE_DIR / 'server_memory.bin'
HOST = '127.0.0.1'
PORT        = 4444
MSG_HEARTBEAT = 0x18
RESP_OK       = 0x19
RESP_ERR      = 0x1F


def build_demo_memory(payload: bytes) -> bytes:
    seeded = MEMORY_FILE.read_bytes() if MEMORY_FILE.exists() \
             else b'username=admin&password=SecurePass123!&api_key=secretkey123'
    return payload + b'|' + seeded + b'|' + b'Z' * 64


def handle_client(conn: socket.socket, vulnerable: bool) -> None:
    with conn:
        header = conn.recv(5)
        if len(header) < 5:
            return
        msg_type, claimed_len, actual_len = struct.unpack('!BHH', header)
        payload = b''
        while len(payload) < actual_len:
            chunk = conn.recv(actual_len - len(payload))
            if not chunk:
                break
            payload += chunk

        if msg_type != MSG_HEARTBEAT:
            conn.sendall(struct.pack('!BH', RESP_ERR, 0))
            return

        if not vulnerable and claimed_len > actual_len:
            message = b'heartbeat rejected: payload length mismatch'
            conn.sendall(struct.pack('!BH', RESP_ERR, len(message)) + message)
            return

        memory   = build_demo_memory(payload)
        response = memory[:claimed_len] if vulnerable else memory[:actual_len]
        conn.sendall(struct.pack('!BH', RESP_OK, len(response)) + response)


def serve(vulnerable: bool) -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((HOST, PORT))
        server.listen(5)
        mode = 'VULNERABLE' if vulnerable else 'PATCHED'
        print(f'[heartbeat] listening on {HOST}:{PORT} ({mode})')
        while True:
            conn, _ = server.accept()
            thread = threading.Thread(target=handle_client, args=(conn, vulnerable), daemon=True)
            thread.start()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Toy Heartbleed-style heartbeat simulator')
    parser.add_argument('--mode', choices=['vulnerable', 'patched'], default='vulnerable')
    args = parser.parse_args()
    serve(vulnerable=args.mode == 'vulnerable')
