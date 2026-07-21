# AWS CLI Agent Orchestrator Evaluation

## Candidate

- Official repository: `awslabs/cli-agent-orchestrator`
- Product name: CLI Agent Orchestrator (CAO)
- Evaluation role: runtime compatibility and deterministic multi-CLI coordination
- TAG 9 status: **HOLD — isolated pilot required**

## Verified characteristics

- Apache-2.0 license.
- Python 3.10+ package with macOS-compatible dependencies.
- Uses `tmux` for terminal/session isolation.
- Uses `uv` for installation.
- Supports Codex CLI, Claude Code, Gemini CLI, Kiro CLI, Kimi CLI, Copilot CLI, OpenCode, and Amazon Q CLI.
- Includes a local server and optional browser UI.
- OpenTelemetry dependencies are optional; TAG 9 evaluation must not install the telemetry extra.
- Upstream supports provider tool restrictions, but enforcement differs by provider.
- A working directory may be passed to sessions; this is not equivalent to automatic Git worktree isolation.

## TAG 9 decision

CAO overlaps substantially with Agent Orchestrator. It must not become a second production engineering control plane unless a pilot proves a unique advantage.

Potential advantages:

- headless and shell-driven orchestration;
- supervisor/worker messaging through MCP;
- multi-provider CLI compatibility;
- tmux visibility and intervention;
- lower UI dependency for deterministic evaluation tasks.

Primary risks:

- multiple agents can multiply token usage rapidly;
- local server and MCP surfaces expand the attack surface;
- unrestricted or `--yolo` mode can bypass safety prompts;
- terminal isolation does not automatically provide repository isolation;
- agent profiles can inject environment variables;
- session logs may retain prompts or command output;
- overlap with Agent Orchestrator can increase operational complexity without business value.

## Mandatory controls

1. Install only in `~/.tag9/orchestrators/aws-cao/`.
2. Pin a tagged release. Do not install from mutable `main` for the pilot.
3. Do not install optional telemetry dependencies.
4. Bind services to localhost only.
5. Use Codex as the sole provider for the first pilot.
6. Never use `--yolo` or unrestricted modes.
7. Create the Git worktree before launching CAO and pass that worktree as the working directory.
8. Do not expose `.env`, client data, production database access, deployment credentials, or unrestricted GitHub tokens.
9. Disable automatic commit, push, merge, deployment, and migrations.
10. Save evaluation reports outside the repository.

## Commands

Audit without installing:

```bash
chmod +x scripts/evaluate-aws-cli-agent-orchestrator-macos.sh
./scripts/evaluate-aws-cli-agent-orchestrator-macos.sh audit
```

Install the pinned release in the isolated evaluation directory:

```bash
./scripts/evaluate-aws-cli-agent-orchestrator-macos.sh install
```

Prepare the read-only pilot worktree and prompt:

```bash
./scripts/evaluate-aws-cli-agent-orchestrator-macos.sh pilot
```

## Pilot acceptance criteria

The candidate receives **PASS** only if all conditions are true:

- CAO starts on Apple Silicon without Rosetta-specific requirements;
- Codex authentication is reused securely without copying credentials into the repository;
- the server is reachable only locally;
- the agent runs only inside the isolated worktree;
- the architecture summary is produced;
- `git status --porcelain` is empty after the pilot;
- zero commits are created;
- no branch is pushed;
- no secrets appear in logs or reports;
- measured token use offers a clear advantage over running Codex directly or through Agent Orchestrator.

## PASS / HOLD / REJECT rubric

- **PASS:** unique headless/runtime value, clean pilot, acceptable token cost, and controls verified.
- **HOLD:** technically viable but duplicates Agent Orchestrator or lacks local evidence.
- **REJECT:** unsafe defaults cannot be controlled, secrets leak, worktree boundaries fail, maintenance is inactive, or token cost exceeds the value delivered.

## Current conclusion

**HOLD.** CAO appears technically compatible and actively maintained, but TAG 9 has not yet produced local installation, authentication, worktree, token-cost, or secrets-handling evidence. Agent Orchestrator remains the primary engineering control plane.
