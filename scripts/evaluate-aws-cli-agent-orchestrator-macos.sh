#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-audit}"
CAO_VERSION="${TAG9_CAO_VERSION:-2.1.1}"
EVAL_ROOT="${TAG9_CAO_EVAL_ROOT:-$HOME/.tag9/orchestrators/aws-cao}"
TOOL_DIR="$EVAL_ROOT/tools"
BIN_DIR="$EVAL_ROOT/bin"
STATE_DIR="$EVAL_ROOT/state"
REPORT_DIR="$EVAL_ROOT/reports"
REPORT="$REPORT_DIR/evaluation-$(date +%Y%m%d-%H%M%S).txt"
REPO_DIR="${TAG9_REPO_DIR:-$HOME/Documents/TAG9/STUDIO}"

log() { printf '\n[TAG 9 AWS CAO] %s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"; }

[[ "$(uname -s)" == "Darwin" ]] || fail "This evaluation harness is for macOS."
[[ "$(uname -m)" == "arm64" ]] || fail "Expected Apple Silicon arm64."
mkdir -p "$TOOL_DIR" "$BIN_DIR" "$STATE_DIR" "$REPORT_DIR"

install_prerequisites() {
  need brew
  brew list python@3.12 >/dev/null 2>&1 || brew install python@3.12
  brew list tmux >/dev/null 2>&1 || brew install tmux
  brew list uv >/dev/null 2>&1 || brew install uv
}

install_isolated() {
  install_prerequisites
  log "Installing CAO $CAO_VERSION in isolated TAG 9 evaluation directories"
  UV_TOOL_DIR="$TOOL_DIR" UV_TOOL_BIN_DIR="$BIN_DIR" \
    uv tool install "cli-agent-orchestrator==$CAO_VERSION" --upgrade
}

audit() {
  {
    echo "TAG 9 AWS CLI Agent Orchestrator Evaluation"
    echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "Architecture: $(uname -m)"
    echo "Evaluation root: $EVAL_ROOT"
    echo "Pinned version: $CAO_VERSION"
    echo "Repository target: $REPO_DIR"
    echo "Production access: prohibited"
    echo "Client data access: prohibited"
    echo "Automatic merge: prohibited"
    echo "YOLO mode: prohibited"
    echo "Telemetry extras: not installed"
    echo
    for cmd in brew python3 tmux uv codex; do
      if command -v "$cmd" >/dev/null 2>&1; then
        echo "FOUND $cmd: $(command -v "$cmd")"
      else
        echo "MISSING $cmd"
      fi
    done
    if [[ -x "$BIN_DIR/cao" ]]; then
      echo "CAO: $($BIN_DIR/cao --version 2>&1 | head -n 1)"
    else
      echo "CAO: not installed in isolated evaluation directory"
    fi
  } | tee "$REPORT"
  log "Audit report: $REPORT"
}

prepare_pilot() {
  [[ -x "$BIN_DIR/cao" ]] || fail "Run '$0 install' first."
  [[ -d "$REPO_DIR/.git" ]] || fail "TAG 9 repository not found: $REPO_DIR"
  [[ -z "$(git -C "$REPO_DIR" status --porcelain)" ]] || fail "Primary checkout must be clean."

  local stamp worktree branch prompt
  stamp="$(date +%Y%m%d-%H%M%S)"
  worktree="$EVAL_ROOT/worktrees/read-only-$stamp"
  branch="evaluation/aws-cao-read-only-$stamp"
  prompt="$EVAL_ROOT/read-only-prompt-$stamp.txt"
  mkdir -p "$EVAL_ROOT/worktrees"
  git -C "$REPO_DIR" worktree add -b "$branch" "$worktree" chore/agent-orchestrator-integration

  cat > "$prompt" <<EOF
Inspect the TAG9INC/STUDIO repository and produce a concise architecture map.
Do not modify files. Do not commit. Do not push. Do not access secrets.
Do not use YOLO or unrestricted mode. Use Codex as the only provider.
Working directory: $worktree
Return major modules, data flows, validation commands, deployment assumptions,
security boundaries, and three low-risk improvements.
EOF

  cat <<EOF | tee -a "$REPORT"
PILOT PREPARED
Worktree: $worktree
Branch: $branch
Prompt: $prompt

Start CAO locally with isolated state and localhost-only binding according to upstream documentation.
Use Codex only, pass the isolated working directory, and do not enable telemetry extras or YOLO mode.
After the agent exits, verify:
  git -C "$worktree" status --porcelain
  git -C "$REPO_DIR" worktree list
  git -C "$worktree" rev-list --count chore/agent-orchestrator-integration..HEAD
EOF
}

case "$MODE" in
  audit) audit ;;
  install) install_isolated; audit ;;
  pilot) audit; prepare_pilot ;;
  *) fail "Usage: $0 [audit|install|pilot]" ;;
esac
