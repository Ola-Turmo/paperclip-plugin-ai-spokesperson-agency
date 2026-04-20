import { DEFAULT_SETTINGS, STATE_KEYS } from "./constants.js";
import type { AgencyOverview, AgencyRequest, AgencySettings, TalentProfile } from "./types.js";

type PluginContext = {
  state: {
    get(input: { scopeKind: "instance" | "company"; scopeId?: string; stateKey: string }): Promise<unknown>;
    set(input: { scopeKind: "instance" | "company"; scopeId?: string; stateKey: string }, value: unknown): Promise<void>;
  };
};

const INSTANCE_SCOPE = { scopeKind: "instance" as const };

export const DEFAULT_TALENTS: TalentProfile[] = [
  {
    id: "talent-nora-pulse",
    name: "Nora Pulse",
    archetype: "Trust-led Nordic educator",
    description: "High-trust Norwegian spokesperson optimized for explainers, onboarding, and conversion-safe product education.",
    languages: ["Norwegian", "English"],
    channels: ["paid social", "landing pages", "onboarding", "webinars"],
    audienceFit: ["education", "SaaS", "public-sector buyers"],
    toneTags: ["clear", "warm", "competent"],
    disclosureClass: "brand_standard",
    likenessClass: "original",
    strengths: ["Course explainers", "Municipality messaging", "Conversion-safe scripts"],
    restrictions: ["No medical claims", "No legal conclusions"],
    availabilityStatus: "available",
    realismLevel: "balanced",
    performanceSummary: { trustScore: 91, conversionScore: 84, educationScore: 93 },
  },
  {
    id: "talent-lev-vertex",
    name: "Lev Vertex",
    archetype: "Founder-style B2B closer",
    description: "Synthetic SaaS host for webinars, demos, founder-adjacent explainers, and pipeline acceleration.",
    languages: ["English", "Norwegian"],
    channels: ["webinars", "product demos", "email", "retargeting"],
    audienceFit: ["B2B SaaS", "operator products", "agencies"],
    toneTags: ["assertive", "precise", "commercial"],
    disclosureClass: "sponsored",
    likenessClass: "original",
    strengths: ["Webinar hosting", "Sales explainers", "Launch narratives"],
    restrictions: ["Requires ad disclosure in performance creative", "No finance advice"],
    availabilityStatus: "available",
    realismLevel: "high_realism",
    performanceSummary: { trustScore: 82, conversionScore: 89, educationScore: 80 },
  },
  {
    id: "talent-mira-clinic",
    name: "Mira Clinic",
    archetype: "Governed health educator",
    description: "Educational presenter for sensitive categories with strong disclosure defaults and narrow approved claim boundaries.",
    languages: ["English", "Georgian"],
    channels: ["education video", "clinic explainers", "faq media"],
    audienceFit: ["health education", "clinic discovery", "regulated onboarding"],
    toneTags: ["calm", "reassuring", "careful"],
    disclosureClass: "public_interest_sensitive",
    likenessClass: "original",
    strengths: ["Health education", "FAQ walkthroughs", "High-trust intros"],
    restrictions: ["No individualized dosing", "Regulated claims require approval"],
    availabilityStatus: "limited",
    realismLevel: "balanced",
    performanceSummary: { trustScore: 94, conversionScore: 73, educationScore: 96 },
  },
];

export async function getTalents(ctx: PluginContext): Promise<TalentProfile[]> {
  const existing = await ctx.state.get({ ...INSTANCE_SCOPE, stateKey: STATE_KEYS.TALENT_REGISTRY });
  if (Array.isArray(existing) && existing.length > 0) {
    return existing as TalentProfile[];
  }
  await ctx.state.set({ ...INSTANCE_SCOPE, stateKey: STATE_KEYS.TALENT_REGISTRY }, DEFAULT_TALENTS);
  return DEFAULT_TALENTS;
}

export async function saveTalents(ctx: PluginContext, talents: TalentProfile[]): Promise<void> {
  await ctx.state.set({ ...INSTANCE_SCOPE, stateKey: STATE_KEYS.TALENT_REGISTRY }, talents);
}

export async function getSettings(ctx: PluginContext): Promise<AgencySettings> {
  const existing = await ctx.state.get({ ...INSTANCE_SCOPE, stateKey: STATE_KEYS.SETTINGS });
  if (existing && typeof existing === "object") {
    return { ...DEFAULT_SETTINGS, ...(existing as AgencySettings) };
  }
  await ctx.state.set({ ...INSTANCE_SCOPE, stateKey: STATE_KEYS.SETTINGS }, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS };
}

export async function getRequests(ctx: PluginContext, companyId: string): Promise<AgencyRequest[]> {
  const existing = await ctx.state.get({ scopeKind: "company", scopeId: companyId, stateKey: STATE_KEYS.REQUESTS });
  return Array.isArray(existing) ? existing as AgencyRequest[] : [];
}

export async function saveRequests(ctx: PluginContext, companyId: string, requests: AgencyRequest[]): Promise<void> {
  await ctx.state.set({ scopeKind: "company", scopeId: companyId, stateKey: STATE_KEYS.REQUESTS }, requests);
}

export function buildOverview(talents: TalentProfile[], requests: AgencyRequest[]): AgencyOverview {
  return {
    talentCount: talents.length,
    availableTalentCount: talents.filter((item) => item.availabilityStatus === "available").length,
    activeRequestCount: requests.filter((item) => !["delivered", "rejected"].includes(item.status)).length,
    awaitingApprovalCount: requests.filter((item) => item.status === "awaiting_approval").length,
    deliveredCount: requests.filter((item) => item.status === "delivered").length,
    highRiskCount: requests.filter((item) => item.riskClass.includes("category_sensitive") || item.riskClass.includes("interactive_spokesperson")).length,
  };
}

