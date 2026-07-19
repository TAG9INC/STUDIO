# TAG 9 Consultant OS

This repository is being converted from the archived OpenClaw/Quantum Studio experiment into the TAG 9 INC Consultant Operating System.

## Safety status

- Original experiment preserved on `archive/openclaw-studio-2026-07-19`.
- Conversion work is isolated on `agent/consultant-os-foundation`.
- Production behavior remains unchanged until the pull request is reviewed and merged.
- Cost control starts in shadow mode.

## Execution policy

Consultant OS always selects the least expensive compliant execution path:

`cache -> function -> workflow -> retrieval -> focused AI -> agent -> human review`

Agents are reserved for tool use or multi-step verification. High-risk work routes to human review.

## Cost-control package

The initial runtime is located at `packages/cost-control` and includes:

- event registry
- deterministic execution router
- token and agent budgets
- stable cache hashing
- four starter workflows
- PostgreSQL telemetry and cache migration
- verification tests

## Commands

```bash
npm install
npm run cost-control:test
npm run cost-control:check
```

## Initial workflows

1. Intake completed
2. Client stalled
3. Consultation completed
4. Report requested

## Rollout

1. Run tests.
2. Deploy with `COST_CONTROL_ENABLED=true` and `COST_CONTROL_SHADOW_MODE=true`.
3. Connect existing Consultant OS model and agent calls to one dispatcher.
4. Review routing telemetry.
5. Disable shadow mode only after verification.

The legacy Studio frontend remains in repository history and on the archive branch for recovery.