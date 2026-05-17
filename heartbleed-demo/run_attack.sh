#!/bin/bash
set -e

python3 -c "import requests" 2>/dev/null || pip3 install -r requirements.txt

echo ""
echo "Running full 3-layer Heartbleed demo..."
echo "Use flags to run individual layers:"
echo "  python3 attacker.py --skip-l2 --skip-l3   # Layer 1 only (TCP)"
echo "  python3 attacker.py --skip-l1 --skip-l3   # Layer 2 only (TLS)"
echo "  python3 attacker.py --skip-l1 --skip-l2   # Layer 3 only (attack chain)"
echo ""

python3 attacker.py "$@"
