import assert from "node:assert/strict";
import { routeTask, evaluateTokenRequest, createInputHash, workflows } from "../dist/index.js";

const task = {
  id: "task-1", type: "test", hasCachedResult: false,
  hasDeterministicHandler: false, hasApprovedWorkflow: false,
  requiresInterpretation: false, requiresTools: false,
  requiresMultiStepVerification: false, riskLevel: "low",
  hasMeaningfulNewData: true, estimatedInputTokens: 1000,
  estimatedOutputTokens: 500
};
const usage = { aiCallsThisWorkflow: 0, agentCallsForClientToday: 0, monthlyTokensForClient: 0, membershipTier: "standard" };

const cases = [
  [{ ...task, riskLevel: "high" }, "HUMAN_REVIEW"],
  [{ ...task, hasCachedResult: true, hasMeaningfulNewData: false }, "CACHE"],
  [{ ...task, hasDeterministicHandler: true }, "FUNCTION"],
  [{ ...task, hasApprovedWorkflow: true }, "WORKFLOW"],
  [{ ...task, requiresInterpretation: true }, "AI_CALL"],
  [{ ...task, requiresTools: true }, "AGENT"]
];
for (const [input, expected] of cases) assert.equal(routeTask(input).executionLevel, expected);
assert.equal(evaluateTokenRequest({ ...task, requiresInterpretation: true }, { ...usage, aiCallsThisWorkflow: 2 }).executionLevel, "HUMAN_REVIEW");
assert.equal(evaluateTokenRequest({ ...task, requiresTools: true }, { ...usage, agentCallsForClientToday: 2 }).executionLevel, "HUMAN_REVIEW");
assert.equal(evaluateTokenRequest({ ...task, requiresInterpretation: true, estimatedInputTokens: 99000, estimatedOutputTokens: 2000 }, usage).executionLevel, "HUMAN_REVIEW");
assert.equal(createInputHash({ b: 2, a: 1 }), createInputHash({ a: 1, b: 2 }));
assert.equal(workflows["client-stalled-v1"].maxAiCalls, 0);
assert.equal(workflows["intake-completed-v1"].maxAiCalls, 1);
assert.equal(workflows["consultation-completed-v1"].maxAiCalls, 1);
assert.equal(workflows["report-requested-v1"].maxAiCalls, 1);
console.log("PASS: 13 Consultant OS control-layer assertions");
