#!/bin/bash
set -e

MODE="${1:-vulnerable}"
DOCKER_PORT="${2:-4443}"

echo "+==================================================================+"
echo "|   SECUREBANK HEARTBLEED DEMO -- Starting all services           |"
echo "+==================================================================+"
echo ""

# ── Python dependencies ────────────────────────────────────────────────────
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: Python 3 is required."
  exit 1
fi
python3 -c "import flask, requests" 2>/dev/null || pip3 install -r requirements.txt

# ── Stop any previous instances ────────────────────────────────────────────
pkill -f "python3 bank_backend.py"    2>/dev/null || true
pkill -f "python3 heartbeat_server.py" 2>/dev/null || true

# ── Layer 1: Flask bank backend (seeds server_memory.bin) ─────────────────
nohup python3 bank_backend.py >/tmp/bank_backend.log 2>&1 &
echo $! > .bank_backend.pid
echo "[+] Flask bank backend started  -> http://127.0.0.1:5000"

# ── Layer 1: TCP heartbeat server ─────────────────────────────────────────
nohup python3 heartbeat_server.py --mode "$MODE" >/tmp/heartbeat_server.log 2>&1 &
echo $! > .heartbeat_server.pid
echo "[+] TCP heartbeat server started -> 127.0.0.1:4444  (mode: $MODE)"

# ── Layers 2 & 3: Docker container (OpenSSL 1.0.1f + Apache + PHP) ────────
echo ""
echo "[*] Building Docker image (OpenSSL 1.0.1f -- this takes a few minutes on first run)..."
docker stop heartbleed-server 2>/dev/null || true
docker rm   heartbleed-server 2>/dev/null || true
docker build -t heartbleed-lab .

if [ $? -ne 0 ]; then
  echo "ERROR: Docker build failed."
  exit 1
fi

echo "[*] Starting container on port $DOCKER_PORT..."
docker run -d --name heartbleed-server -p "$DOCKER_PORT":443 heartbleed-lab
sleep 4

if curl -k -s --max-time 3 "https://localhost:$DOCKER_PORT" >/dev/null 2>&1; then
  echo "[+] Docker container running -> https://localhost:$DOCKER_PORT"
else
  echo "[!] Container may still be starting -- check: docker logs heartbleed-server"
fi

echo ""
echo "+==================================================================+"
echo "|  All services active                                            |"
echo "|  Flask UI:      http://127.0.0.1:5000                          |"
echo "|  TCP heartbeat: 127.0.0.1:4444   (mode: $MODE)                 |"
echo "|  Docker HTTPS:  https://localhost:$DOCKER_PORT  (OpenSSL 1.0.1f)|"
echo "|                                                                 |"
echo "|  Run full attack:  ./run_attack.sh                              |"
echo "|  Run layer only:   python3 attacker.py --skip-l2 --skip-l3     |"
echo "+==================================================================+"
