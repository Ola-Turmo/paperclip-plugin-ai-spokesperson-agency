import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import { ACTION_KEYS, DATA_KEYS, JOB_KEYS, PLUGIN_ID, PLUGIN_VERSION, TOOL_KEYS } from "./constants.js";
import { classifyRequestRisk } from "./policy.js";
import { buildOverview, getRequests, getSettings, getTalents, saveRequests } from "./state.js";
import type { AgencyRequest, ApprovalRecord, DeliveryPackage, PerformanceReport } from "./types.js";

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

const plugin = definePlugin({
  async setup(ctx) {
    ctx.logger.info(`${PLUGIN_ID} v${PLUGIN_VERSION} starting`);

    ctx.data.register(DATA_KEYS.OVERVIEW, async (params) => {
      const companyId = String(params.companyId ?? "");
      const talents = await getTalents(ctx);
      const requests = companyId ? await getRequests(ctx, companyId) : [];
      const settings = await getSettings(ctx);
      return {
        overview: buildOverview(talents, requests),
        settings,
      };
    });

    ctx.data.register(DATA_KEYS.TALENTS, async (params) => {
      const talents = await getTalents(ctx);
      const language = String(params.language ?? "").toLowerCase();
      const channel = String(params.channel ?? "").toLowerCase();
      const audience = String(params.audience ?? "").toLowerCase();
      return talents.filter((talent) => {
        if (language && !talent.languages.some((value) => value.toLowerCase().includes(language))) return false;
        if (channel && !talent.channels.some((value) => value.toLowerCase().includes(channel))) return false;
        if (audience && !talent.audienceFit.some((value) => value.toLowerCase().includes(audience))) return false;
        return true;
      });
    });

    ctx.data.register(DATA_KEYS.REQUESTS, async (params) => {
      const companyId = String(params.companyId ?? "");
      if (!companyId) return [];
      return getRequests(ctx, companyId);
    });

    ctx.data.register(DATA_KEYS.SETTINGS, async () => getSettings(ctx));

    ctx.actions.register(ACTION_KEYS.SEED_DEMO, async (params) => {
      const companyId = String(params.companyId ?? "");
      const companyName = String(params.companyName ?? "Demo Company");
      if (!companyId) return { success: false, error: "companyId is required" };
      const requests = await getRequests(ctx, companyId);
      if (requests.length > 0) {
        return { success: true, seeded: false, count: requests.length };
      }
      const classification = classifyRequestRisk({
        claimSensitivity: "standard brand",
        markets: ["Norway"],
        targetChannels: ["paid social", "landing pages"],
        preferredTalentMode: "either",
        prohibitedClaims: [],
        objective: "launch spokesperson campaign",
      });
      const sample: AgencyRequest = {
        id: makeId("req"),
        companyId,
        companyName,
        title: "Launch always-on spokesperson system",
        objective: "Create a reusable spokesperson system for paid, landing, onboarding, and webinar content.",
        targetAudience: "Nordic operators and growth teams",
        targetChannels: ["paid social", "landing pages", "webinars"],
        markets: ["Norway", "Sweden"],
        languages: ["Norwegian", "English"],
        productSummary: "Governed synthetic talent service for SaaS and education brands.",
        claimSensitivity: "standard brand",
        budgetBand: "€4k-€8k monthly",
        deadline: nowIso(),
        prohibitedClaims: ["No deceptive impersonation", "No regulated outcome promises"],
        preferredTalentMode: "either",
        status: "classified",
        riskClass: classification.riskClass,
        requiredApprovals: classification.requiredApprovals,
        disclosureFlags: classification.disclosureFlags,
        recommendedTalentIds: ["talent-nora-pulse", "talent-lev-vertex"],
        approvals: [],
        deliveryPackages: [],
        performance: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      await saveRequests(ctx, companyId, [sample]);
      return { success: true, seeded: true, count: 1 };
    });

    ctx.actions.register(ACTION_KEYS.CREATE_REQUEST, async (params) => {
      const companyId = String(params.companyId ?? "");
      const companyName = String(params.companyName ?? "Unknown Company");
      if (!companyId) return { success: false, error: "companyId is required" };
      const classification = classifyRequestRisk({
        claimSensitivity: String(params.claimSensitivity ?? "standard"),
        markets: Array.isArray(params.markets) ? params.markets.map(String) : [],
        targetChannels: Array.isArray(params.targetChannels) ? params.targetChannels.map(String) : [],
        preferredTalentMode: (params.preferredTalentMode as AgencyRequest["preferredTalentMode"]) ?? "either",
        prohibitedClaims: Array.isArray(params.prohibitedClaims) ? params.prohibitedClaims.map(String) : [],
        objective: String(params.objective ?? ""),
      });
      const request: AgencyRequest = {
        id: makeId("req"),
        companyId,
        companyName,
        title: String(params.title ?? "Untitled agency request"),
        objective: String(params.objective ?? ""),
        targetAudience: String(params.targetAudience ?? ""),
        targetChannels: Array.isArray(params.targetChannels) ? params.targetChannels.map(String) : [],
        markets: Array.isArray(params.markets) ? params.markets.map(String) : [],
        languages: Array.isArray(params.languages) ? params.languages.map(String) : [],
        productSummary: String(params.productSummary ?? ""),
        claimSensitivity: String(params.claimSensitivity ?? "standard"),
        budgetBand: String(params.budgetBand ?? "Unspecified"),
        deadline: typeof params.deadline === "string" ? params.deadline : undefined,
        prohibitedClaims: Array.isArray(params.prohibitedClaims) ? params.prohibitedClaims.map(String) : [],
        preferredTalentMode: (params.preferredTalentMode as AgencyRequest["preferredTalentMode"]) ?? "either",
        status: "classified",
        riskClass: classification.riskClass,
        requiredApprovals: classification.requiredApprovals,
        disclosureFlags: classification.disclosureFlags,
        recommendedTalentIds: (await getTalents(ctx)).slice(0, 2).map((talent) => talent.id),
        approvals: [],
        deliveryPackages: [],
        performance: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      const requests = await getRequests(ctx, companyId);
      requests.unshift(request);
      await saveRequests(ctx, companyId, requests);
      await ctx.activity.log({
        companyId,
        message: `Agency request created: ${request.title}`,
        entityType: "agency_request",
        entityId: request.id,
      });
      return { success: true, request };
    });

    ctx.actions.register(ACTION_KEYS.UPDATE_STATUS, async (params) => {
      const companyId = String(params.companyId ?? "");
      const requestId = String(params.requestId ?? "");
      const status = String(params.status ?? "") as AgencyRequest["status"];
      const requests = await getRequests(ctx, companyId);
      const request = requests.find((item) => item.id === requestId);
      if (!request) return { success: false, error: "Request not found" };
      request.status = status;
      request.updatedAt = nowIso();
      await saveRequests(ctx, companyId, requests);
      return { success: true, request };
    });

    ctx.actions.register(ACTION_KEYS.RECORD_APPROVAL, async (params) => {
      const companyId = String(params.companyId ?? "");
      const requestId = String(params.requestId ?? "");
      const requests = await getRequests(ctx, companyId);
      const request = requests.find((item) => item.id === requestId);
      if (!request) return { success: false, error: "Request not found" };
      const approval: ApprovalRecord = {
        id: makeId("approval"),
        approvalClass: String(params.approvalClass ?? "approve_spokesperson_campaign") as ApprovalRecord["approvalClass"],
        status: String(params.status ?? "approved") as ApprovalRecord["status"],
        reviewer: String(params.reviewer ?? "Agency Operator"),
        note: typeof params.note === "string" ? params.note : undefined,
        at: nowIso(),
      };
      request.approvals.unshift(approval);
      request.updatedAt = nowIso();
      if (approval.status === "approved") {
        request.status = "approved";
      }
      await saveRequests(ctx, companyId, requests);
      return { success: true, approval, request };
    });

    ctx.actions.register(ACTION_KEYS.ADD_DELIVERY, async (params) => {
      const companyId = String(params.companyId ?? "");
      const requestId = String(params.requestId ?? "");
      const requests = await getRequests(ctx, companyId);
      const request = requests.find((item) => item.id === requestId);
      if (!request) return { success: false, error: "Request not found" };
      const delivery: DeliveryPackage = {
        id: makeId("delivery"),
        label: String(params.label ?? "Campaign delivery"),
        assetTypes: Array.isArray(params.assetTypes) ? params.assetTypes.map(String) : ["video script", "thumbnail", "rights sheet"],
        usageRights: String(params.usageRights ?? "Paid + owned media for 12 months"),
        disclosureInstructions: Array.isArray(params.disclosureInstructions) ? params.disclosureInstructions.map(String) : ["Mark synthetic spokesperson use", "Mark sponsored placements clearly"],
        usageBoundaries: Array.isArray(params.usageBoundaries) ? params.usageBoundaries.map(String) : ["No undisclosed endorsement use", "No regulated claims outside approved script"],
        deliveredAt: nowIso(),
      };
      request.deliveryPackages.unshift(delivery);
      request.status = "delivered";
      request.updatedAt = nowIso();
      await saveRequests(ctx, companyId, requests);
      return { success: true, delivery, request };
    });

    ctx.actions.register(ACTION_KEYS.RECORD_PERFORMANCE, async (params) => {
      const companyId = String(params.companyId ?? "");
      const requestId = String(params.requestId ?? "");
      const requests = await getRequests(ctx, companyId);
      const request = requests.find((item) => item.id === requestId);
      if (!request) return { success: false, error: "Request not found" };
      const performance: PerformanceReport = {
        reportedAt: nowIso(),
        engagementQuality: Number(params.engagementQuality ?? 0),
        trustSignal: Number(params.trustSignal ?? 0),
        conversionLift: Number(params.conversionLift ?? 0),
        fatigueRisk: Number(params.fatigueRisk ?? 0),
        notes: String(params.notes ?? ""),
      };
      request.performance.unshift(performance);
      request.status = "learning";
      request.updatedAt = nowIso();
      await saveRequests(ctx, companyId, requests);
      return { success: true, performance, request };
    });

    ctx.tools.register(
      TOOL_KEYS.BROWSE_TALENT,
      {
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
      async (params: unknown) => {
        const input = (params ?? {}) as Record<string, unknown>;
        const talents = await getTalents(ctx);
        const language = String(input.language ?? "").toLowerCase();
        const channel = String(input.channel ?? "").toLowerCase();
        const audience = String(input.audience ?? "").toLowerCase();
        const filtered = talents.filter((talent) => {
          if (language && !talent.languages.some((value) => value.toLowerCase().includes(language))) return false;
          if (channel && !talent.channels.some((value) => value.toLowerCase().includes(channel))) return false;
          if (audience && !talent.audienceFit.some((value) => value.toLowerCase().includes(audience))) return false;
          return true;
        });
        return { content: `Found ${filtered.length} talent profile(s).`, data: filtered };
      },
    );

    ctx.tools.register(
      TOOL_KEYS.REQUEST_CAMPAIGN,
      {
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
      async (params: unknown) => {
        const result = await (async () => {
          const input = (params ?? {}) as Record<string, unknown>;
          const companyId = String(input.companyId ?? "");
          const companyName = String(input.companyName ?? "Unknown Company");
          const classification = classifyRequestRisk({
            claimSensitivity: String(input.claimSensitivity ?? "standard"),
            markets: Array.isArray(input.markets) ? input.markets.map(String) : [],
            targetChannels: Array.isArray(input.targetChannels) ? input.targetChannels.map(String) : [],
            preferredTalentMode: (input.preferredTalentMode as AgencyRequest["preferredTalentMode"]) ?? "either",
            prohibitedClaims: Array.isArray(input.prohibitedClaims) ? input.prohibitedClaims.map(String) : [],
            objective: String(input.objective ?? ""),
          });
          const request: AgencyRequest = {
            id: makeId("req"),
            companyId,
            companyName,
            title: String(input.title ?? "Untitled agency request"),
            objective: String(input.objective ?? ""),
            targetAudience: String(input.targetAudience ?? ""),
            targetChannels: Array.isArray(input.targetChannels) ? input.targetChannels.map(String) : [],
            markets: Array.isArray(input.markets) ? input.markets.map(String) : [],
            languages: Array.isArray(input.languages) ? input.languages.map(String) : [],
            productSummary: String(input.productSummary ?? ""),
            claimSensitivity: String(input.claimSensitivity ?? "standard"),
            budgetBand: String(input.budgetBand ?? "Unspecified"),
            deadline: typeof input.deadline === "string" ? input.deadline : undefined,
            prohibitedClaims: Array.isArray(input.prohibitedClaims) ? input.prohibitedClaims.map(String) : [],
            preferredTalentMode: (input.preferredTalentMode as AgencyRequest["preferredTalentMode"]) ?? "either",
            status: "classified",
            riskClass: classification.riskClass,
            requiredApprovals: classification.requiredApprovals,
            disclosureFlags: classification.disclosureFlags,
            recommendedTalentIds: (await getTalents(ctx)).slice(0, 2).map((talent) => talent.id),
            approvals: [],
            deliveryPackages: [],
            performance: [],
            createdAt: nowIso(),
            updatedAt: nowIso(),
          };
          const requests = await getRequests(ctx, companyId);
          requests.unshift(request);
          await saveRequests(ctx, companyId, requests);
          await ctx.activity.log({
            companyId,
            message: `Agency request created: ${request.title}`,
            entityType: "agency_request",
            entityId: request.id,
          });
          return request;
        })();
        return { content: `Created request ${result.title}.`, data: result };
      },
    );

    ctx.tools.register(
      TOOL_KEYS.GET_REQUEST_STATUS,
      {
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
      async (params: unknown) => {
        const input = (params ?? {}) as Record<string, unknown>;
        const companyId = String(input.companyId ?? "");
        const requestId = String(input.requestId ?? "");
        const requests = await getRequests(ctx, companyId);
        const request = requests.find((item) => item.id === requestId) ?? null;
        return { content: request ? `Status is ${request.status}.` : "Request not found.", data: request };
      },
    );

    ctx.tools.register(
      TOOL_KEYS.RECORD_FEEDBACK,
      {
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
      async (params: unknown) => {
        const input = (params ?? {}) as Record<string, unknown>;
        const companyId = String(input.companyId ?? "");
        const requestId = String(input.requestId ?? "");
        const requests = await getRequests(ctx, companyId);
        const request = requests.find((item) => item.id === requestId);
        if (!request) {
          return { error: "Request not found." };
        }
        const performance: PerformanceReport = {
          reportedAt: nowIso(),
          engagementQuality: Number(input.engagementQuality ?? 0),
          trustSignal: Number(input.trustSignal ?? 0),
          conversionLift: Number(input.conversionLift ?? 0),
          fatigueRisk: Number(input.fatigueRisk ?? 0),
          notes: String(input.notes ?? ""),
        };
        request.performance.unshift(performance);
        request.status = "learning";
        request.updatedAt = nowIso();
        await saveRequests(ctx, companyId, requests);
        return { content: "Recorded campaign learning.", data: performance };
      },
    );

    ctx.events.on("issue.created", async () => {
      ctx.logger.info("Observed issue.created for agency bridge");
    });

    ctx.jobs.register(JOB_KEYS.DAILY_SERVICE_DIGEST, async () => {
      ctx.logger.info("AI spokesperson agency daily digest completed");
    });

    ctx.logger.info(`${PLUGIN_ID} setup complete`);
  },

  async onHealth() {
    return { status: "ok", message: "AI spokesperson agency bridge is running", version: PLUGIN_VERSION };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
