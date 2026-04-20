export type DisclosureClass =
  | "brand_standard"
  | "sponsored"
  | "affiliate"
  | "synthetic_interaction"
  | "public_interest_sensitive";

export type LikenessClass =
  | "original"
  | "founder_inspired"
  | "founder_approved"
  | "real_person_derived";

export type ServiceRiskClass =
  | "standard_brand_content"
  | "sponsored_or_endorsement"
  | "category_sensitive"
  | "likeness_sensitive"
  | "interactive_spokesperson"
  | "multi_market_rollout";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "classified"
  | "scoped"
  | "in_production"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "delivered"
  | "learning";

export type ApprovalClass =
  | "approve_spokesperson_campaign"
  | "approve_regulated_claim_script"
  | "approve_founder_likeness_use"
  | "approve_sponsored_synthetic_endorsement"
  | "approve_live_ai_spokesperson_launch"
  | "approve_multi_market_spokesperson_rollout";

export type TalentProfile = {
  id: string;
  name: string;
  archetype: string;
  description: string;
  languages: string[];
  channels: string[];
  audienceFit: string[];
  toneTags: string[];
  disclosureClass: DisclosureClass;
  likenessClass: LikenessClass;
  strengths: string[];
  restrictions: string[];
  availabilityStatus: "available" | "limited" | "internal_only";
  realismLevel: "stylized" | "balanced" | "high_realism";
  performanceSummary: {
    trustScore: number;
    conversionScore: number;
    educationScore: number;
  };
};

export type ApprovalRecord = {
  id: string;
  approvalClass: ApprovalClass;
  status: "pending" | "approved" | "rejected";
  reviewer: string;
  note?: string;
  at: string;
};

export type DeliveryPackage = {
  id: string;
  label: string;
  assetTypes: string[];
  usageRights: string;
  disclosureInstructions: string[];
  usageBoundaries: string[];
  deliveredAt: string;
};

export type PerformanceReport = {
  reportedAt: string;
  engagementQuality: number;
  trustSignal: number;
  conversionLift: number;
  fatigueRisk: number;
  notes: string;
};

export type AgencyRequest = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  objective: string;
  targetAudience: string;
  targetChannels: string[];
  markets: string[];
  languages: string[];
  productSummary: string;
  claimSensitivity: string;
  budgetBand: string;
  deadline?: string;
  prohibitedClaims: string[];
  preferredTalentMode: "existing" | "new" | "either";
  status: RequestStatus;
  riskClass: ServiceRiskClass[];
  requiredApprovals: ApprovalClass[];
  disclosureFlags: string[];
  recommendedTalentIds: string[];
  approvals: ApprovalRecord[];
  deliveryPackages: DeliveryPackage[];
  performance: PerformanceReport[];
  createdAt: string;
  updatedAt: string;
};

export type AgencyOverview = {
  talentCount: number;
  availableTalentCount: number;
  activeRequestCount: number;
  awaitingApprovalCount: number;
  deliveredCount: number;
  highRiskCount: number;
};

export type AgencySettings = {
  defaultDisclosureMode: string;
  defaultRightsWindow: string;
  interactiveLaunchRequiresApproval: boolean;
  founderLikenessRequiresApproval: boolean;
  multiMarketThreshold: number;
  targetSlaDays: number;
};

