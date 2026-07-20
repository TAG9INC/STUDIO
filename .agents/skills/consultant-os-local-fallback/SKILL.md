---
name: consultant-os-local-fallback
description: Route suitable Consultant OS work to a local OpenAI-compatible model through Ollama or LM Studio, then fall back to cloud models when local inference is unavailable, insufficient, or unsafe. Use for private client data, repetitive drafting, summarization, classification, extraction, transformation, offline continuity, or cost control. Keep live research, connector actions, legal or financial verification, current facts, and high-stakes decisions on verified cloud or source-grounded workflows.
---

# Consultant OS Local Fallback

Use this skill as a routing control plane. Do not describe local inference as unlimited, infallible, or a substitute for current sources.

## Routing order

1. Inspect the task for sensitivity, freshness, tool dependence, and risk.
2. Prefer local inference for:
   - summarization and rewriting
   - classification and tagging
   - document extraction from already available text
   - first drafts, scripts, checklists, and templates
   - internal brainstorming
   - private client information when local processing is available
3. Prefer cloud/source-grounded execution for:
   - current news, regulations, prices, jobs, contracts, or market facts
   - web research and citations
   - Gmail, Calendar, Drive, GitHub, or other connector actions
   - legal, medical, financial, immigration, or compliance conclusions
   - tasks requiring stronger reasoning than the local model demonstrates
4. Try local endpoints in this order unless environment variables override it:
   - Ollama: `http://127.0.0.1:11434`
   - LM Studio OpenAI-compatible server: `http://127.0.0.1:1234/v1`
5. If no local endpoint responds, continue with the normal Consultant OS cloud workflow and clearly record `route=cloud-fallback` in internal logs when logging exists.

## Required environment variables

- `CONSULTANT_OS_LOCAL_PROVIDER=auto|ollama|lmstudio|off`
- `CONSULTANT_OS_LOCAL_MODEL=<installed model name>`
- `OLLAMA_BASE_URL=http://127.0.0.1:11434`
- `LM_STUDIO_BASE_URL=http://127.0.0.1:1234/v1`
- `CONSULTANT_OS_LOCAL_TIMEOUT=120`

## Invocation

Use `scripts/local_fallback_router.py` for endpoint health checks and local completions. Pass prompts through standard input or `--prompt`. Never send secrets, passwords, payment-card data, or authentication tokens to any model.

## Quality gate

After local generation:

1. Check that the response follows the requested format.
2. Check calculations and factual claims.
3. Escalate to source-grounded cloud execution when the answer depends on current or high-stakes facts.
4. Do not silently present an unverified local answer as verified intelligence.

## Test protocol

Run:

```bash
python3 scripts/local_fallback_router.py --health
python3 scripts/local_fallback_router.py --prompt "Return exactly: LOCAL_FALLBACK_OK"
```

A successful live test requires Ollama or LM Studio to be running on the Consultant OS machine with a model installed.