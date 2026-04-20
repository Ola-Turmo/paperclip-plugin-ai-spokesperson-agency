export const PLUGIN_ID = "ai-spokesperson-agency";
export const PLUGIN_VERSION = "0.1.0";

export const DATA_KEYS = {
  OVERVIEW: "agency.overview",
  TALENTS: "agency.talents",
  REQUESTS: "agency.requests",
  SETTINGS: "agency.settings",
} as const;

export const ACTION_KEYS = {
  SEED_DEMO: "agency.seed_demo",
  CREATE_REQUEST: "agency.create_request",
  UPDATE_STATUS: "agency.update_request_status",
  RECORD_APPROVAL: "agency.record_approval",
  ADD_DELIVERY: "agency.add_delivery",
  RECORD_PERFORMANCE: "agency.record_performance",
} as const;

export const TOOL_KEYS = {
  BROWSE_TALENT: "agency_browse_talent",
  REQUEST_CAMPAIGN: "agency_request_spokesperson_campaign",
  GET_REQUEST_STATUS: "agency_get_request_status",
  RECORD_FEEDBACK: "agency_record_campaign_feedback",
} as const;

export const JOB_KEYS = {
  DAILY_SERVICE_DIGEST: "daily-service-digest",
} as const;

export const STATE_KEYS = {
  TALENT_REGISTRY: "agency.talent_registry",
  REQUESTS: "agency.requests",
  SETTINGS: "agency.settings",
} as const;

export const DEFAULT_SETTINGS = {
  defaultDisclosureMode: "always_on",
  defaultRightsWindow: "twelve_months",
  interactiveLaunchRequiresApproval: true,
  founderLikenessRequiresApproval: true,
  multiMarketThreshold: 2,
  targetSlaDays: 5,
} as const;

