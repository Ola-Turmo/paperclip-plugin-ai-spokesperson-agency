import test from "node:test";
import assert from "node:assert/strict";
import { classifyRequestRisk } from "../src/policy.ts";

test("classifyRequestRisk escalates sponsored and multi-market requests", () => {
  const result = classifyRequestRisk({
    claimSensitivity: "standard",
    markets: ["Norway", "UK"],
    targetChannels: ["paid social"],
    preferredTalentMode: "either",
    prohibitedClaims: [],
    objective: "sponsored launch campaign",
  });

  assert.ok(result.riskClass.includes("sponsored_or_endorsement"));
  assert.ok(result.riskClass.includes("multi_market_rollout"));
  assert.ok(result.requiredApprovals.includes("approve_sponsored_synthetic_endorsement"));
  assert.ok(result.requiredApprovals.includes("approve_multi_market_spokesperson_rollout"));
});
