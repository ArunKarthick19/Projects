#!/usr/bin/env python3
from __future__ import annotations

import os
import secrets
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
MEMORY_FILE = BASE_DIR / 'server_memory.bin'

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path='')


def _build_memory_blob(username: str, password: str) -> bytes:
    session = secrets.token_hex(12)
    heartbeat_nonce = secrets.token_hex(8)
    account_ref = f"ACCT-{secrets.randbelow(900000)+100000}"
    parts = [
        b"srvhdr|region=sg|service=bank-demo|",
        os.urandom(10),
        f"username={username}&password={password}&session={session}&api_key=secretkey123&account={account_ref}&nonce={heartbeat_nonce}|".encode(),
        os.urandom(14),
        f"timestamp={datetime.utcnow().isoformat()}Z|feature=toy-heartbeat|".encode(),
        os.urandom(18),
        b"endbuf",
    ]
    return b"".join(parts)


def _write_memory(username: str, password: str) -> dict:
    blob = _build_memory_blob(username, password)
    MEMORY_FILE.write_bytes(blob)
    text = blob.decode('latin1', errors='ignore')
    return {
        'username': username,
        'password': password,
        'session_preview': text.split('session=')[1][:12] + '...',
        'stored_bytes': len(blob),
    }


@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/dashboard.html')
def dashboard():
    return send_from_directory(BASE_DIR, 'dashboard.html')


@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or request.form or {}
    username = str(data.get('username', 'admin')).strip() or 'admin'
    password = str(data.get('password', 'SecurePass123!')).strip() or 'SecurePass123!'
    session_info = _write_memory(username, password)
    return jsonify({
        'ok': True,
        'message': 'Sensitive server-side session initialized for demo.',
        **session_info,
    })


@app.route('/api/session-info')
def api_session_info():
    if MEMORY_FILE.exists():
        blob = MEMORY_FILE.read_bytes()
        text = blob.decode('latin1', errors='ignore')
        return jsonify({
            'initialized': True,
            'stored_bytes': len(blob),
            'contains_secret': 'secretkey123' in text,
            'preview': text[:120],
        })
    return jsonify({'initialized': False, 'stored_bytes': 0, 'contains_secret': False, 'preview': ''})


@app.route('/api/seed-token', methods=['POST'])
def seed_token():
    """Called by backend.php when a reset token is generated.
    Appends the token into server_memory.bin so it shows up in the Layer 1 heap dump."""
    data  = request.get_json(silent=True) or {}
    token = data.get('reset_token', '')
    username = data.get('username', '')
    if MEMORY_FILE.exists() and token:
        existing = MEMORY_FILE.read_bytes()
        extra    = f"|reset_token={token}&for={username}|".encode()
        MEMORY_FILE.write_bytes(existing + extra)
    return jsonify({'ok': True})


@app.route('/healthz')
def healthz():
    return jsonify({'ok': True})


if __name__ == '__main__':
    if not MEMORY_FILE.exists():
        _write_memory('admin', 'SecurePass123!')
    app.run(host='127.0.0.1', port=5000, debug=False)
