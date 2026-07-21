#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${TAG9_REPO_DIR:-$HOME/Documents/TAG9/STUDIO}"
PILOT_ROOT="${TAG9_PILOT_ROOT:-$HOME/.tag9/pilots}"
BASE_BRANCH="${TAG9_PILOT_BASE_BRANCH:-chore/agent-orchestrator-integration}"
STAMP="$(date +%Y%m%d-%H%M%S)"
WORKTREE="$PILOT_ROOT/read-only-$STAMP"
BRANCH="pilot/read-only-$STAMP"
REPORT="$PILOT_ROOT/read-only-$STAMP-report.txt"

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
log() { printf '\n[TAG 9 PILOT] %s\n' "$*"; }

command -v git >/dev/null 2>&1 || fail "git is required."
[[ -d "$REPO_DIR/.git" ]] || fail "Repository not found: $REPO_DIR"
mkdir -p "$PILOT_ROOT"

cd "$REPO_DIR"
[[ -z "$(git status --porcelain)" ]] || fail "Primary checkout is not clean. Preserve or commit local work before pilot execution."
git show-ref --verify --quiet "refs/heads/$BASE_BRANCH" || git show-ref --verify --quiet "refs/remotes/origin/$BASE_BRANCH" || fail "Base branch not found: $BASE_BRANCH"

log "Creating isolated worktree"
git worktree add -b "$BRANCH" "$WORKTREE" "$BASE_BRANCH"

cat > "$WORKTREE/TAG9_AGENT_PILOT_PROMPT.txt" <<'EOF'
Inspect the TAG9INC/STUDIO repository and produce a concise architecture map. Do not modify files, do not commit, do not push, and do not access secrets.

Return only:
- major modules
- primary data flows
- available validation commands
- deployment assumptions
- security boundaries
- three low-risk improvements
EOF

PROMPT_HASH="$(shasum -a 256 "$WORKTREE/TAG9_AGENT_PILOT_PROMPT.txt" | awk '{print $1}')"
rm "$WORKTREE/TAG9_AGENT_PILOT_PROMPT.txt"

cat > "$REPORT" <<EOF
TAG 9 Agent Orchestrator Read-Only Pilot
Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Repository: $REPO_DIR
Base branch: $BASE_BRANCH
Pilot branch: $BRANCH
Worktree: $WORKTREE
Prompt SHA-256: $PROMPT_HASH

MANUAL AO ACTION REQUIRED
1. Open Agent Orchestrator.
2. Add project: $REPO_DIR
3. Select Codex as the only worker.
4. Configure isolated worktree: $WORKTREE
5. Paste the approved read-only prompt from deployment documentation.
6. Disable automatic commit, push, merge, deployment, migrations, and secret access.
7. Save the agent summary outside the repository or in the AO session transcript.

POST-PILOT VALIDATION COMMAND
TAG9_PILOT_WORKTREE="$WORKTREE" TAG9_PILOT_REPORT="$REPORT" scripts/validate-agent-orchestrator-pilot.sh check
EOF

if [[ "${1:-prepare}" == "check" ]]; then
  WORKTREE="${TAG9_PILOT_WORKTREE:-}"
  REPORT="${TAG9_PILOT_REPORT:-}"
  [[ -n "$WORKTREE" && -d "$WORKTREE" ]] || fail "Set TAG9_PILOT_WORKTREE to the prepared pilot worktree."
  [[ -n "$REPORT" ]] || fail "Set TAG9_PILOT_REPORT to the prepared report path."
  cd "$WORKTREE"
  STATUS="$(git status --porcelain)"
  AHEAD="$(git rev-list --count "$BASE_BRANCH"..HEAD)"
  TRACKING="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"
  {
    echo
    echo "POST-PILOT EVIDENCE"
    echo "Checked: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "HEAD: $(git rev-parse HEAD)"
    echo "Status entries: ${STATUS:-none}"
    echo "Commits ahead of base: $AHEAD"
    echo "Upstream tracking: ${TRACKING:-none}"
    echo "Worktrees:"
    git -C "$REPO_DIR" worktree list
  } | tee -a "$REPORT"

  [[ -z "$STATUS" ]] || fail "Pilot modified files. Read-only validation failed."
  [[ "$AHEAD" -eq 0 ]] || fail "Pilot created commits. Read-only validation failed."
  [[ -z "$TRACKING" ]] || fail "Pilot branch has an upstream, which may indicate push configuration. Review required."
  log "PASS: read-only pilot left no file changes or commits. Evidence: $REPORT"
  exit 0
fi

log "Pilot prepared without launching an agent. Follow the report instructions: $REPORT"
