#!/usr/bin/env python3
"""Consultant OS local model router for Ollama and LM Studio.

Uses only Python standard library. It checks local endpoints and performs a
single completion. Cloud fallback is signaled to the caller; this script does
not transmit data to any cloud service.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any


def request_json(url: str, payload: dict[str, Any] | None = None, timeout: int = 10) -> dict[str, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def ollama_health(base: str, timeout: int) -> bool:
    try:
        request_json(base.rstrip("/") + "/api/tags", timeout=timeout)
        return True
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        return False


def lmstudio_health(base: str, timeout: int) -> bool:
    try:
        request_json(base.rstrip("/") + "/models", timeout=timeout)
        return True
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        return False


def choose_provider(timeout: int) -> tuple[str | None, str | None]:
    requested = os.getenv("CONSULTANT_OS_LOCAL_PROVIDER", "auto").lower()
    ollama = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    lmstudio = os.getenv("LM_STUDIO_BASE_URL", "http://127.0.0.1:1234/v1")

    if requested == "off":
        return None, None
    if requested in ("auto", "ollama") and ollama_health(ollama, timeout):
        return "ollama", ollama
    if requested in ("auto", "lmstudio") and lmstudio_health(lmstudio, timeout):
        return "lmstudio", lmstudio
    return None, None


def complete(provider: str, base: str, model: str, prompt: str, timeout: int) -> str:
    if provider == "ollama":
        result = request_json(
            base.rstrip("/") + "/api/generate",
            {"model": model, "prompt": prompt, "stream": False},
            timeout,
        )
        return str(result.get("response", "")).strip()

    result = request_json(
        base.rstrip("/") + "/chat/completions",
        {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        },
        timeout,
    )
    choices = result.get("choices") or []
    if not choices:
        return ""
    return str(choices[0].get("message", {}).get("content", "")).strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--health", action="store_true")
    parser.add_argument("--prompt")
    args = parser.parse_args()

    timeout = int(os.getenv("CONSULTANT_OS_LOCAL_TIMEOUT", "120"))
    provider, base = choose_provider(min(timeout, 10))

    if args.health:
        if provider:
            print(json.dumps({"status": "ready", "provider": provider, "base_url": base}))
            return 0
        print(json.dumps({"status": "cloud-fallback", "reason": "no local endpoint available"}))
        return 2

    prompt = args.prompt if args.prompt is not None else sys.stdin.read()
    if not prompt.strip():
        print("No prompt provided", file=sys.stderr)
        return 64
    if not provider or not base:
        print(json.dumps({"route": "cloud-fallback", "reason": "no local endpoint available"}))
        return 2

    model = os.getenv("CONSULTANT_OS_LOCAL_MODEL", "gpt-oss:20b")
    try:
        text = complete(provider, base, model, prompt, timeout)
    except (OSError, urllib.error.URLError, json.JSONDecodeError) as exc:
        print(json.dumps({"route": "cloud-fallback", "reason": str(exc)}))
        return 2

    if not text:
        print(json.dumps({"route": "cloud-fallback", "reason": "empty local response"}))
        return 2

    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
