#!/bin/bash
set +e

[ -f .bank_backend.pid ]     && kill "$(cat .bank_backend.pid)"     2>/dev/null && rm -f .bank_backend.pid
[ -f .heartbeat_server.pid ] && kill "$(cat .heartbeat_server.pid)" 2>/dev/null && rm -f .heartbeat_server.pid
pkill -f "python3 bank_backend.py"     2>/dev/null || true
pkill -f "python3 heartbeat_server.py" 2>/dev/null || true

docker stop heartbleed-server 2>/dev/null || true
docker rm   heartbleed-server 2>/dev/null || true

echo "All SecureBank demo services stopped."
