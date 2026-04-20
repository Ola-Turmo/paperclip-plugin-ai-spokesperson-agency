import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import { ACTION_KEYS, DATA_KEYS, JOB_KEYS, PLUGIN_ID, PLUGIN_VERSION, TOOL_KEYS, DEFAULT_SETTINGS } from "./constants.js";

const manifest: PaperclipPluginManifestV1 = {
  id: PLUGIN_ID,
  apiVersion: 1,
  version: PLUGIN_VERSION,
  displayName: "AI Spokesperson Agency",
  description:
    "Cross-company governed service bridge for AI influencers and AI spokesperson fulfillment, approvals, rights, delivery, and learning.",
  author: "Ola Turmo",
  categories: ["automation", "ui", "connector"],
  capabilities: [
    "companies.read",
    "issues.read",
    "issue.comments.read",
    "issue.comments.create",
    "plugin.state.read",
    "plugin.state.write",
    "events.subscribe",
    "jobs.schedule",
    "activity.log.write",
    "agent.tools.register",
    "instance.settings.register",
    "ui.page.register",
    "ui.dashboardWidget.register",
    "ui.sidebar.register",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui",
  },
  instanceConfigSchema: {
    type: "object",
    properties: {
      defaultDisclosureMode: {
        type: "string",
        default: DEFAULT_SETTINGS.defaultDisclosureMode,
        title: "Default disclosure mode",
      },
      defaultRightsWindow: {
        type: "string",
        default: DEFAULT_SETTINGS.defaultRightsWindow,
        title: "Default rights window",
      },
      interactiveLaunchRequiresApproval: {
        type: "boolean",
        default: DEFAULT_SETTINGS.interactiveLaunchRequiresApproval,
        title: "Interactive launches require approval",
      },
      founderLikenessRequiresApproval: {
        type: "boolean",
        default: DEFAULT_SETTINGS.founderLikenessRequiresApproval,
        title: "Founder likeness requires approval",
      },
      multiMarketThreshold: {
        type: "number",
        default: DEFAULT_SETTINGS.multiMarketThreshold,
        minimum: 1,
        title: "Multi-market threshold",
      },
      targetSlaDays: {
        type: "number",
        default: DEFAULT_SETTINGS.targetSlaDays,
        minimum: 1,
        title: "Target SLA days",
      },
    },
    additionalProperties: false,
  },
  jobs: [
    {
      jobKey: JOB_KEYS.DAILY_SERVICE_DIGEST,
      displayName: "Daily service digest",
      description: "Summarizes stalled requests, pending approvals, and delivery load for the agency service bridge.",
      schedule: "0 7 * * *",
    },
  ],
  tools: [
    {
      name: TOOL_KEYS.BROWSE_TALENT,
      displayName: "Browse agency talent",
      description: "List available AI spokesperson and influencer talent matched to channels, markets, and trust level.",
      parametersSchema: {
        type: "object",
        properties: {
          language: { type: "string" },
          channel: { type: "string" },
          audience: { type: "string" },
        },
        additionalProperties: false,
      },
    },
    {
      name: TOOL_KEYS.REQUEST_CAMPAIGN,
      displayName: "Request spokesperson campaign",
      description: "Create a governed intake request for synthetic spokesperson or influencer work from the agency company.",
      parametersSchema: {
        type: "object",
        required: ["companyId", "companyName", "title", "objective", "targetAudience"],
        properties: {
          companyId: { type: "string" },
          companyName: { type: "string" },
          title: { type: "string" },
          objective: { type: "string" },
          targetAudience: { type: "string" },
          targetChannels: { type: "array", items: { type: "string" } },
          markets: { type: "array", items: { type: "string" } },
          languages: { type: "array", items: { type: "string" } },
          productSummary: { type: "string" },
          claimSensitivity: { type: "string" },
          budgetBand: { type: "string" },
        },
      },
    },
    {
      name: TOOL_KEYS.GET_REQUEST_STATUS,
      displayName: "Get campaign request status",
      description: "Retrieve a service request with current approvals, work order state, and delivery packages.",
      parametersSchema: {
        type: "object",
        required: ["companyId", "requestId"],
        properties: {
          companyId: { type: "string" },
          requestId: { type: "string" },
        },
      },
    },
    {
      name: TOOL_KEYS.RECORD_FEEDBACK,
      displayName: "Record campaign feedback",
      description: "Attach delivery performance and learning feedback back into the agency service loop.",
      parametersSchema: {
        type: "object",
        required: ["companyId", "requestId", "notes"],
        properties: {
          companyId: { type: "string" },
          requestId: { type: "string" },
          engagementQuality: { type: "number" },
          trustSignal: { type: "number" },
          conversionLift: { type: "number" },
          fatigueRisk: { type: "number" },
          notes: { type: "string" },
        },
      },
    },
  ],
  ui: {
    slots: [
      {
        type: "page",
        id: "agency-page",
        displayName: "AI Spokesperson Agency",
        exportName: "AgencyPage",
        routePath: "ai-spokesperson-agency",
      },
      {
        type: "dashboardWidget",
        id: "agency-widget",
        displayName: "AI Spokesperson Agency",
        exportName: "AgencyWidget",
      },
      {
        type: "sidebar",
        id: "agency-sidebar",
        displayName: "AI Spokesperson Agency",
        exportName: "AgencySidebarLink",
      },
      {
        type: "settingsPage",
        id: "agency-settings",
        displayName: "AI Spokesperson Agency",
        exportName: "AgencySettingsPage",
      }
    ],
  },
};

export default manifest;

