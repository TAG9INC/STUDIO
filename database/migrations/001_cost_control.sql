CREATE TABLE IF NOT EXISTS consultant_events (
  id UUID PRIMARY KEY,
  client_id TEXT,
  event_name TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY,
  client_id TEXT,
  workflow_id TEXT,
  task_type TEXT NOT NULL,
  execution_level TEXT NOT NULL,
  model_tier TEXT,
  model_name TEXT,
  prompt_version TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost NUMERIC(12,6) NOT NULL DEFAULT 0,
  cache_hit BOOLEAN NOT NULL DEFAULT FALSE,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_output_cache (
  id UUID PRIMARY KEY,
  client_id TEXT,
  task_type TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  state_version INTEGER NOT NULL DEFAULT 1,
  output JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(client_id, task_type, prompt_version, input_hash)
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_client_created ON ai_usage(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_unprocessed ON consultant_events(processed_at) WHERE processed_at IS NULL;
