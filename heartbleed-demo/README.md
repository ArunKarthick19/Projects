# SecureBank Heartbleed Demo — Full 3-Layer

## Overview

| Layer | What it shows | TLS? | Real OpenSSL? |
|-------|--------------|------|---------------|
| 1 — TCP over-read      | Core bug mechanic: claimed_len vs actual_len | No  | No  |
| 2 — TLS heartbeat      | Real CVE-2014-0160 fired at OpenSSL 1.0.1f   | Yes | Yes |
| 3 — Attack chain       | Token theft → admin takeover → fraud         | Yes | Yes (container) |

## Requirements
- Python 3.8+  (`pip install flask requests`)
- Docker (for Layers 2 & 3)

## Quick Start

```bash
chmod +x *.sh

# Start all services (vulnerable mode)
./start_server.sh

# In another terminal — run the full 3-layer attack
./run_attack.sh

# Run individual layers
python3 attacker.py --skip-l2 --skip-l3   # Layer 1 only (TCP, no Docker needed)
python3 attacker.py --skip-l1 --skip-l3   # Layer 2 only (TLS heartbeat)
python3 attacker.py --skip-l1 --skip-l2   # Layer 3 only (attack chain)

# Start in patched mode (Layer 1 will show the fix)
./start_server.sh patched

# Stop everything
./stop_server.sh
```

## Architecture

```
attacker.py
    |
    |-- Layer 1 --> TCP :4444  heartbeat_server.py
    |                    bank_backend.py (Flask :5000, seeds server_memory.bin)
    |
    |-- Layer 2 --> HTTPS :4443  Docker (Apache + OpenSSL 1.0.1f)
    |                             sends raw TLS heartbeat record
    |
    +-- Layer 3 --> HTTPS :4443  Docker (backend.php + heartbleed_test.php)
                                  token theft -> password reset -> admin actions
```

## What each file does

| File | Purpose |
|------|---------|
| `attacker.py`          | Main attack script (all 3 layers) |
| `heartbeat_server.py`  | Layer 1: toy TCP heartbeat server (vulnerable/patched) |
| `bank_backend.py`      | Layer 1: Flask backend that seeds session data into memory |
| `server_memory.bin`    | Layer 1: seeded memory blob |
| `heartbleed_test.php`  | Layer 3: simulates memory disclosure (returns reset tokens) |
| `backend.php`          | Layer 3: banking actions (login, reset, add_funds, delete_user) |
| `Dockerfile`           | Builds Ubuntu 12.04 + OpenSSL 1.0.1f + Apache + PHP5 |
| `start_server.sh`      | Starts all services |
| `stop_server.sh`       | Stops all services |
| `run_attack.sh`        | Runs attacker.py with optional layer flags |
