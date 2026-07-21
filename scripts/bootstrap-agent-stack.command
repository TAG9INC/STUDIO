#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
chmod +x scripts/install-agent-stack-macos.sh
./scripts/install-agent-stack-macos.sh full
printf '\nDone. Press Return to close.\n'
read -r
