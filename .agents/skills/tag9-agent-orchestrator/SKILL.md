---
name: tag9-agent-orchestrator
description: Coordinate parallel AI coding agents for TAG 9 repositories through Agent Orchestrator. Use when assigning repository work across Codex, Claude Code, Kimi, Cursor, Aider, OpenCode, or reviewer agents; creating isolated worktrees; routing CI failures and review feedback; planning multi-agent implementation; or controlling token cost and merge risk. This skill manages engineering work only and must not be used as the production client-workflow engine for Consultant OS.
---

# TAG 9 Agent Orchestrator

Use Agent Orchestrator as the engineering control plane for TAG 9 repositories.

## Operating rules

1. Inspect the target repository, branch, tests, deployment path, and uncommitted changes before assigning work.
2. Break the objective into non-overlapping tasks with explicit file ownership and acceptance criteria.
3. Use the least expensive capable runner:
   - deterministic script or existing test before an AI agent
   - Codex for focused implementation and repository changes
   - Claude Code for architecture, refactors, and complex review
   - Kimi for long-context synthesis when already configured
   - reviewer agents only after implementation and tests
4. Give each worker a separate Git worktree and branch.
5. Never give two workers simultaneous write ownership of the same file set.
6. Require each worker to return changed files, tests run, results, unresolved risks, and the next action.
7. Route CI failures, review comments, and merge conflicts back to the worker that owns the change.
8. Require human approval before merging changes that affect production data, authentication, billing, permissions, legal/compliance logic, migrations, or secrets.
9. Never expose API keys, tokens, client records, or production credentials in prompts, logs, commits, screenshots, or agent memory.
10. Stop parallel work when task boundaries are unclear or merge risk exceeds the expected speed benefit.

## Standard execution plan

For each objective, produce:

- objective and repository
- selected workers and why
- task dependency graph
- branch and worktree plan
- file ownership boundaries
- test and review gates
- token or cost limits
- merge order
- rollback plan

## Default worker pattern

- Architect: define interfaces, constraints, and acceptance criteria.
- Implementer: make the focused code change.
- Tester: add or run deterministic tests.
- Reviewer: inspect correctness, security, and maintainability.
- Integrator: resolve conflicts and prepare the final PR.

Combine roles when the task is small. Do not create agents merely to fill every role.

## Platform boundary

Agent Orchestrator supervises coding agents and Git workflows. It does not replace the Consultant OS production stack for 15,000 clients. Production client workflows must remain in the TAG 9 control plane using durable workflow execution, tenant-isolated data, audit logs, and cost controls.

## Completion evidence

Return:

- repository and base branch
- sessions created
- agent runtime used for each session
- branches and worktrees
- files changed
- tests and CI results
- review findings
- merge status
- token/cost notes
- unresolved blockers
