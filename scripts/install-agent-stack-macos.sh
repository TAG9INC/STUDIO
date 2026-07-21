#!/usr/bin/env bash
set -euo pipefail

PROFILE="${1:-core}"
REPO_DIR="${TAG9_REPO_DIR:-$HOME/Documents/TAG9/STUDIO}"
EVAL_DIR="${TAG9_ORCHESTRATOR_EVAL_DIR:-$HOME/.tag9/orchestrators}"
REPORT_DIR="${TAG9_REPORT_DIR:-$HOME/.tag9/reports}"
TMP_DIR="$(mktemp -d)"
REPORT_FILE="$REPORT_DIR/agent-stack-$(date +%Y%m%d-%H%M%S).txt"
trap 'rm -rf "$TMP_DIR"' EXIT

log() { printf '\n[TAG 9] %s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }
version_line() {
  local label="$1"; shift
  if have "$1"; then
    printf 'OK   %-22s %s\n' "$label" "$("$@" 2>&1 | head -n 1)"
  else
    printf 'FAIL %-22s missing\n' "$label"
    return 1
  fi
}

[[ "$(uname -s)" == "Darwin" ]] || fail "This installer is for macOS only."
[[ "$(uname -m)" == "arm64" ]] || fail "Expected Apple Silicon arm64, found: $(uname -m)"
have curl || fail "curl is required."
have ditto || fail "ditto is required."

mkdir -p "$REPORT_DIR" "$EVAL_DIR"

install_homebrew() {
  if have brew; then
    log "Homebrew already installed"
    return
  fi
  log "Installing Homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)"
  have brew || fail "Homebrew installation did not produce a usable brew command."
}

install_core_tools() {
  install_homebrew
  log "Installing core engineering dependencies"
  brew install git gh jq tmux node pnpm
}

install_agent_orchestrator() {
  local url="https://github.com/AgentWrapper/agent-orchestrator/releases/latest/download/agent-orchestrator-darwin-arm64.zip"
  local zip="$TMP_DIR/agent-orchestrator.zip"
  local unpack="$TMP_DIR/ao"
  local app

  if [[ -d "/Applications/Agent Orchestrator.app" ]]; then
    log "Agent Orchestrator already installed"
    return
  fi

  log "Downloading Agent Orchestrator for Apple Silicon"
  curl -fL --proto '=https' --tlsv1.2 --retry 3 --retry-delay 2 "$url" -o "$zip"
  [[ -s "$zip" ]] || fail "Agent Orchestrator download is empty."
  mkdir -p "$unpack"
  ditto -x -k "$zip" "$unpack"
  app="$(find "$unpack" -maxdepth 3 -type d -name '*.app' -print -quit)"
  [[ -n "$app" ]] || fail "No macOS application was found in the archive."

  log "Installing Agent Orchestrator in /Applications"
  if [[ -w /Applications ]]; then
    ditto "$app" "/Applications/Agent Orchestrator.app"
  else
    echo "macOS may request the administrator password to copy the signed application into /Applications. Enter it only in the local Terminal prompt; never paste it into chat."
    sudo ditto "$app" "/Applications/Agent Orchestrator.app"
  fi

  [[ -d "/Applications/Agent Orchestrator.app" ]] || fail "Application copy failed."
  codesign --verify --deep --strict "/Applications/Agent Orchestrator.app" || fail "macOS code-signature verification failed."
  spctl --assess --type execute "/Applications/Agent Orchestrator.app" || fail "Gatekeeper assessment failed."
}

install_agent_clis() {
  have npm || fail "npm is required before installing agent CLIs."
  log "Installing supported agent CLIs"
  npm install -g @openai/codex @anthropic-ai/claude-code @google/gemini-cli
}

prepare_optional_evaluation() {
  have git || fail "git is required for evaluation checkouts."
  if [[ ! -d "$EVAL_DIR/cli-agent-orchestrator/.git" ]]; then
    log "Cloning AWS CLI Agent Orchestrator into isolated evaluation directory"
    git clone --filter=blob:none https://github.com/awslabs/cli-agent-orchestrator.git "$EVAL_DIR/cli-agent-orchestrator"
  else
    log "AWS CLI Agent Orchestrator evaluation checkout already exists"
  fi

  cat > "$EVAL_DIR/README.md" <<'EOF'
# TAG 9 Orchestrator Evaluation Area

Everything here is evaluation-only. Do not connect production infrastructure, client data, database credentials, deployment tokens, or unrestricted GitHub credentials.

Evaluation order:
1. Agent Orchestrator
2. AWS CLI Agent Orchestrator
3. Bernstein
4. Agent Kanban
5. AgentsMesh

A candidate must receive PASS, HOLD, or REJECT after license, maintenance, telemetry, secrets, Apple Silicon, worktree isolation, Codex compatibility, overlap, and token-impact review.
EOF
}

verify() {
  local failures=0
  {
    echo "TAG 9 Agent Stack Verification"
    echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "Architecture: $(uname -m)"
    echo "Repository: $REPO_DIR"
    echo
    [[ -d "/Applications/Agent Orchestrator.app" ]] && echo "OK   Agent Orchestrator     /Applications/Agent Orchestrator.app" || { echo "FAIL Agent Orchestrator     missing"; failures=$((failures + 1)); }
    version_line "Homebrew" brew --version || failures=$((failures + 1))
    version_line "Git" git --version || failures=$((failures + 1))
    version_line "GitHub CLI" gh --version || failures=$((failures + 1))
    version_line "jq" jq --version || failures=$((failures + 1))
    version_line "tmux" tmux -V || failures=$((failures + 1))
    version_line "Node.js" node --version || failures=$((failures + 1))
    version_line "npm" npm --version || failures=$((failures + 1))
    version_line "pnpm" pnpm --version || failures=$((failures + 1))
    version_line "Codex CLI" codex --version || failures=$((failures + 1))
    version_line "Claude Code" claude --version || failures=$((failures + 1))
    version_line "Gemini CLI" gemini --version || failures=$((failures + 1))
    [[ -d "$REPO_DIR/.git" ]] && echo "OK   TAG 9 repository       $REPO_DIR" || { echo "FAIL TAG 9 repository       not found"; failures=$((failures + 1)); }
    echo
    echo "Authentication is intentionally not written to this report."
    echo "Run interactively: gh auth status; codex login; claude; gemini"
    echo "Failures: $failures"
  } | tee "$REPORT_FILE"

  [[ "$failures" -eq 0 ]] || fail "Verification found $failures missing or invalid requirement(s). Report: $REPORT_FILE"
  log "Verification passed. Report: $REPORT_FILE"
}

case "$PROFILE" in
  core)
    install_agent_orchestrator
    ;;
  agents)
    install_core_tools
    install_agent_orchestrator
    install_agent_clis
    ;;
  full)
    install_core_tools
    install_agent_orchestrator
    install_agent_clis
    prepare_optional_evaluation
    ;;
  verify)
    ;;
  *)
    fail "Usage: $0 [core|agents|full|verify]"
    ;;
esac

verify
log "Installation automation completed"
echo "Launch with: open -a 'Agent Orchestrator'"
echo "No API keys, tokens, passwords, production deployments, merges, or database migrations were performed."
