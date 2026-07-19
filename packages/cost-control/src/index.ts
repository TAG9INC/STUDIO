import { createHash } from "node:crypto";

export type RiskLevel = "low" | "medium" | "high";
export type ExecutionLevel = "CACHE" | "FUNCTION" | "WORKFLOW" | "AI_CALL" | "AGENT" | "HUMAN_REVIEW";
export type ModelTier = "small" | "standard" | "advanced";

export interface ConsultantTask {
  id: string;
  type: string;
  clientId?: string;
  workflowId?: string;
  hasCachedResult: boolean;
  hasDeterministicHandler: boolean;
  hasApprovedWorkflow: boolean;
  requiresInterpretation: boolean;
  requiresTools: boolean;
  requiresMultiStepVerification: boolean;
  riskLevel: RiskLevel;
  hasMeaningfulNewData: boolean;
  estimatedInputTokens?: number;
  estimatedOutputTokens?: number;
}

export interface RouteDecision {
  executionLevel: ExecutionLevel;
  reason: string;
  modelTier?: ModelTier;
}

export interface UsageState {
  aiCallsThisWorkflow: number;
  agentCallsForClientToday: number;
  monthlyTokensForClient: number;
  membershipTier: "standard" | "premium";
}

export const CONSULTANT_EVENTS = [
  "CLIENT_CREATED", "INTAKE_STARTED", "INTAKE_COMPLETED", "DOCUMENT_UPLOADED",
  "REQUIREMENT_COMPLETED", "CONSULTATION_BOOKED", "CONSULTATION_COMPLETED",
  "CLIENT_STALLED", "PAYMENT_RECEIVED", "PAYMENT_FAILED", "REPORT_REQUESTED",
  "RESEARCH_REQUESTED", "PROJECT_COMPLETED", "HUMAN_REVIEW_REQUIRED"
] as const;

export function routeTask(task: ConsultantTask): RouteDecision {
  if (task.riskLevel === "high") return { executionLevel: "HUMAN_REVIEW", reason: "High-risk task requires human review." };
  if (task.hasCachedResult && !task.hasMeaningfulNewData) return { executionLevel: "CACHE", reason: "Valid cached output exists." };
  if (task.hasDeterministicHandler) return { executionLevel: "FUNCTION", reason: "A deterministic function can complete the task." };
  if (task.hasApprovedWorkflow && !task.requiresInterpretation && !task.requiresTools) return { executionLevel: "WORKFLOW", reason: "Approved workflow can complete the task." };
  if (task.requiresInterpretation && !task.requiresTools && !task.requiresMultiStepVerification) {
    return { executionLevel: "AI_CALL", modelTier: (task.estimatedInputTokens ?? 0) <= 3000 ? "small" : "standard", reason: "Bounded interpretation required." };
  }
  if (task.requiresTools || task.requiresMultiStepVerification) return { executionLevel: "AGENT", modelTier: "advanced", reason: "Tools or multi-step verification required." };
  return { executionLevel: "HUMAN_REVIEW", reason: "No approved automated route exists." };
}

const LIMITS = {
  maxAiCallsPerWorkflow: 2,
  maxAgentCallsPerClientPerDay: 2,
  monthlyTokens: { standard: 100_000, premium: 500_000 }
} as const;

export function evaluateTokenRequest(task: ConsultantTask, usage: UsageState): RouteDecision {
  const route = routeTask(task);
  if (route.executionLevel === "AI_CALL" && usage.aiCallsThisWorkflow >= LIMITS.maxAiCallsPerWorkflow) return { executionLevel: "HUMAN_REVIEW", reason: "Workflow AI-call budget exceeded." };
  if (route.executionLevel === "AGENT" && usage.agentCallsForClientToday >= LIMITS.maxAgentCallsPerClientPerDay) return { executionLevel: "HUMAN_REVIEW", reason: "Daily agent-call budget exceeded." };
  const estimated = (task.estimatedInputTokens ?? 0) + (task.estimatedOutputTokens ?? 0);
  if ((route.executionLevel === "AI_CALL" || route.executionLevel === "AGENT") && usage.monthlyTokensForClient + estimated > LIMITS.monthlyTokens[usage.membershipTier]) {
    return { executionLevel: "HUMAN_REVIEW", reason: "Monthly token budget would be exceeded." };
  }
  return route;
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, val]) => [key, stable(val)]));
  return value;
}

export function createInputHash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(stable(input))).digest("hex");
}

export const workflows = {
  "intake-completed-v1": { trigger: "INTAKE_COMPLETED", maxAiCalls: 1 },
  "client-stalled-v1": { trigger: "CLIENT_STALLED", maxAiCalls: 0 },
  "consultation-completed-v1": { trigger: "CONSULTATION_COMPLETED", maxAiCalls: 1 },
  "report-requested-v1": { trigger: "REPORT_REQUESTED", maxAiCalls: 1 }
} as const;
