# TAG 9 Agent Kanban Evaluation

## Decision

**HOLD — self-hosted, metadata-only pilot required.**

Agent Kanban is not approved as a production Consultant OS workflow engine or as an autonomous merge authority. It may be evaluated as a human-visible coordination board for engineering agents after the controls below are satisfied.

## Candidate

- Upstream: `saltbo/agent-kanban`
- Purpose: shared engineering task board and coordination layer for human and AI coding agents
- License: FSL-1.1-ALv2; converts to Apache-2.0 after the license change date defined upstream
- Hosted quick start: requires an Agent Kanban account and machine API key
- Supported leader runtimes include Codex CLI, Claude Code, Gemini CLI, GitHub Copilot CLI, Hermes and other compatible runtimes

## Potential TAG 9 value

- visible task status across agents and repositories;
- explicit leader and worker roles;
- agent identity and task attribution;
- worktree dispatch through the machine daemon;
- task dependencies, review state and human oversight;
- coordination