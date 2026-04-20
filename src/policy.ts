import type {
  AgencyRequest,
  ApprovalClass,
  ServiceRiskClass,
} from "./types.js";

export function classifyRequestRisk(
  input: Pick<
    AgencyRequest,
    | "claimSensitivity"
    | "markets"
    | "targetChannels"
    | "preferredTalentMode"
    | "prohibitedClaims"
    | "objective"
  >,
): {
  riskClass: ServiceRiskClass[];
  requiredApprovals: ApprovalClass[];
  disclosureFlags: string[];
} {
  const risks = new Set<ServiceRiskClass>();
  const approvals = new Set<ApprovalClass>(["approve_spokesperson_campaign"]);
  const disclosures = new Set<string>(["Synthetic presenter disclosure"]);

  const sensitivity = input.claimSensitivity.toLowerCase();
  const objective = input.objective.toLowerCase();
  const channels = input.targetChannels.map((value) => value.toLowerCase());

  if (
    sensitivity.includes("health")
    || sensitivity.includes("legal")
    || sensitivity.includes("finance")
    || sensitivity.includes("tax")
    || sensitivity.includes("medical")
  ) {
    risks.add("category_sensitive");
    approvals.add("approve_regulated_claim_script");
    disclosures.add("High-trust claim review required");
  }

  if (
    channels.some((channel) => channel.includes("ad") || channel.includes("paid"))
    || objective.includes("endorsement")
    || objective.includes("affiliate")
    || objective.includes("promotion")
  ) {
    risks.add("sponsored_or_endorsement");
    approvals.add("approve_sponsored_synthetic_endorsement");
    disclosures.add("Paid promotion disclosure");
  }

  if (channels.some((channel) => channel.includes("interactive") || channel.includes("live"))) {
    risks.add("interactive_spokesperson");
    approvals.add("approve_live_ai_spokesperson_launch");
    disclosures.add("Interactive AI disclosure");
  }

  if (input.markets.length > 1) {
    risks.add("multi_market_rollout");
    approvals.add("approve_multi_market_spokesperson_rollout");
  }

  if (input.preferredTalentMode === "new" && input.prohibitedClaims.join(" ").toLowerCase().includes("likeness")) {
    risks.add("likeness_sensitive");
    approvals.add("approve_founder_likeness_use");
  }

  if (risks.size === 0) {
    risks.add("standard_brand_content");
  }

  return {
    riskClass: [...risks],
    requiredApprovals: [...approvals],
    disclosureFlags: [...disclosures],
  };
}

