#!/usr/bin/env bash
set -euo pipefail

PROFILE="${1:-core}"
REPO_DIR="${TAG9_REPO_DIR:-$HOME/Documents/TAG9/STUDIO}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

log() { printf '\n[TAG 9] %s\n' "$*"; }
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }; }

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This installer is for macOS only." >&2
  exit 1
fi

ARCH="$(uname -m)"
if [[ "$ARCH" != "arm64" ]]; then
  echo "Expected Apple Silicon arm64, found: $ARCH" >&2
  exit 1
fi

need curl
need ditto
need git

install_agent_orchestrator() {
  local url="https://github.com/AgentWrapper/agent-orchestrator/releases/latest/download/agent-orchestrator-darwin-arm64.zip"
  local zip="$TMP_DIR/agent-orchestrator.zip"
  local unpack="$TMP_DIR/ao"

  if [[ -d "/Applications/Agent Orchestrator.app" ]]; then
    log "Agent Orchestrator is already installed. Skipping copy."
    return
  fi

  log "Downloading Agent Orchestrator for Apple Silicon"
  curl -fL --retry 3 --retry-delay 2 "$url" -o "$zip"
  mkdir -p "$unpack"
  ditto -x -k "$zip" "$unpack"

  local app
  app="$(find "$unpack" -maxdepth 3 -type d -name '*.app' -print -quit)"
  if [[ -z "$app" ]]; then
    echo "No macOS application was found in the downloaded archive." >&2
    exit 1
  fi

  log "Installing Agent Orchestrator in /Applications"
  if [[ -w /Applications ]]; then
    ditto "$app" "/Applications/Agent Orchestrator.app"
  else
    sudo ditto "$app" "/Applications/Agent Orchestrator.app"
  fi
  xattr -dr com.apple.quarantine "/Applications/Agent Orchestrator.app" 2>/dev/null || true
}

install_homebrew() {
  if command -v brew >/dev/null 2>&1; then
    log "Homebrew already installed"
    return
  fi
  log "Installing Homebrew"
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)"
}

install_core_tools() {
  install_homebrew
  log "Installing core engineering dependencies"
  brew install git gh jq tmux node pnpm || true
}

install_agent_clis() {
  log "Installing supported agent CLIs where public package installation is available"
  npm install -g @openai/codex @anthropic-ai/claude-code @google/gemini-cli || true
}

install_optional_orchestrators() {
  install_homebrew
  mkdir -p "$HOME/.tag9/orchestrators"

  if [[ ! -d "$HOME/.tag9/orchestrators/cli-agent-orchestrator/.git" ]]; then
    log "Cloning AWS CLI Agent Orchestrator for evaluation"
    git clone https://github.com/awslabs/cli-agent-orchestrator.git "$HOME/.tag9/orchestrators/cli-agent-orchestrator" || true
  fi

  cat > "$HOME/.tag9/orchestrators/README.md" <<'EOF'
# TAG 9 Orchestrator Evaluation Area

Installed candidates are evaluation-only until security, license, and pilot checks pass.

Priority order:
1. Agent Orchestrator — active engineering control plane.
2. AWS CLI Agent Orchestrator — multi-runtime fallback/evaluation.
3. Other candidates — install only after case-by-case review.

Never place production client secrets, database credentials, or unrestricted deployment tokens in an orchestrator workspace.
EOF
}

verify() {
  log "Verification"
  [[ -d "/Applications/Agent Orchestrator.app" ]] && echo "OK  Agent Orchestrator installed" || echo "FAIL Agent Orchestrator missing"
  command -v git >/dev/null 2>&1 && echo "OK  git: $(git --version)" || true
  command -v gh >/dev/null 2>&1 && echo "OK  gh: $(gh --version | head -n 1)" || true
  command -v node >/dev/null 2>&1 && echo "OK  node: $(node --version)" || true
  command -v codex >/dev/null 2>&1 && echo "OK  Codex CLI installed" || echo "INFO Codex CLI requires installation or PATH refresh"
  command -v claude >/dev/null 2>&1 && echo "OK  Claude Code installed" || echo "INFO Claude Code requires installation or PATH refresh"
  command -v gemini >/dev/null 2>&1 && echo "OK  Gemini CLI installed" || echo "INFO Gemini CLI requires installation or PATH refresh"

  if [[ -d "$REPO_DIR/.git" ]]; then
    echo "OK  TAG 9 repository found: $REPO_DIR"
  else
    echo "INFO TAG 9 repository not found at $REPO_DIR"
    echo "     Set TAG9_REPO_DIR before running, or clone TAG9INC/STUDIO there."
  fi
}

case "$PROFILE" in
  core)
    install_agent_orchestrator
    ;;
  agents)
    install_agent_orchestrator
    install_core_tools
    install_agent_clis
    ;;
  full)
    install_agent_orchestrator
    install_core_tools
    install_agent_clis
    install_optional_orchestrators
    ;;
  verify)
    ;;
  *)
    echo "Usage: $0 [core|agents|full|verify]" >&2
    exit 2
    ;;
esac

verify

log "Installation automation completed"
echo "Authentication remains intentionally separate. Run: codex login, claude, and gemini, then follow each provider's secure login flow."
echo "Launch AO with: open -a 'Agent Orchestrator'"
