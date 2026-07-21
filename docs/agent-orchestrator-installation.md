# TAG 9 Agent Orchestrator Installation

## Decision

Use `AgentWrapper/agent-orchestrator` as the engineering control plane for parallel AI coding agents. Keep it outside the production Consultant OS runtime. Agent Orchestrator manages repositories, worktrees, terminals, pull requests, CI feedback, and reviewer loops; it does not manage the 15,000-client production lifecycle.

## Why this selection

- Apache-2.0 license.
- Desktop application is the supported installation path.
- Separate Git worktree for each coding session.
- Supports Codex, Claude Code, Kimi, Cursor, Aider, OpenCode, and other terminal agents.
- Routes CI failures, review comments, and merge conflicts back to the responsible session.
- Provides visible session and pull-request supervision.

## macOS installation

1. Confirm the Mac architecture:

   ```bash
   uname -m
   ```

   - `arm64`: download the Apple silicon build.
   - `x86_64`: download the Intel build.

2. Download the latest desktop release from the upstream Agent Orchestrator release page.
3. Extract the application and move it to `/Applications`.
4. Open Agent Orchestrator and select the local checkout of `TAG9INC/STUDIO`.
5. Configure only the agent CLIs already approved by TAG 9. Recommended first runner: Codex. Add Claude Code or Kimi only after their authentication and cost controls are verified.
6. Do not place API keys in this repository. Authenticate each CLI through its approved local credential flow.

The legacy npm package is frozen and is not the preferred setup for new installations.

## TAG 9 rollout

### Phase 1: Shadow evaluation

- Use a non-production branch.
- Run one agent at a time for the first two tasks.
- Require a human to review every diff and command.
- Record task duration, token/API cost, changed files, test results, and corrections required.

### Phase 2: Controlled parallel work

- Maximum three simultaneous workers.
- Give each worker non-overlapping file ownership.
- Require deterministic tests before reviewer-agent execution.
- Prohibit automatic merge.

### Phase 3: Production engineering use

Enable larger parallel runs only after:

- worktree cleanup is reliable;
- CI feedback reaches the correct session;
- secrets do not appear in logs or prompts;
- cost telemetry is available;
- rollback and branch protection are tested.

## Initial TAG 9 agent roles

| Role | Preferred runner | Scope |
|---|---|---|
| Focused implementer | Codex | Small and medium repository changes |
| Architecture reviewer | Claude Code | Interfaces, refactors, security-sensitive design |
| Long-context analyst | Kimi | Large repository or documentation synthesis |
| Deterministic tester | Scripts/CI | Tests, lint, build, schema checks |
| Human approver | TAG 9 owner | Production, security, billing, migrations, merge |

## Security controls

- Do not send production client records to coding agents.
- Never expose `.env`, tokens, private keys, payment data, or authentication cookies.
- Keep production database access unavailable to worker sessions by default.
- Protect `main` and require pull-request review.
- Disable telemetry in a custom build when TAG 9 policy requires it by leaving the PostHog key empty.
- Use least-privilege GitHub credentials.

## Pilot task

Use this first controlled assignment:

> Inspect the TAG 9 Studio repository and propose a read-only architecture map. Do not modify application code. Return major modules, data flows, current skills, test commands, deployment assumptions, security concerns, and three low-risk improvements.

This validates repository access and agent behavior without risking production changes.

## Acceptance evidence

The installation is considered operational only when the following are recorded:

- desktop application launches;
- `TAG9INC/STUDIO` opens successfully;
- Codex session starts in an isolated worktree;
- no production credentials are visible;
- the pilot task completes;
- changed files are zero for the read-only pilot;
- session status and terminal are visible;
- worktree cleanup succeeds.
