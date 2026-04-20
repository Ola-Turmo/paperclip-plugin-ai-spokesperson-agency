import React, { useState } from "react";
import {
  usePluginAction,
  usePluginData,
  usePluginToast,
  type PluginPageProps,
  type PluginSidebarProps,
  type PluginWidgetProps,
} from "@paperclipai/plugin-sdk/ui";
import { ACTION_KEYS, DATA_KEYS } from "../constants.js";

const styles = {
  shell: {
    display: "grid",
    gap: 18,
    minHeight: "100%",
    padding: 20,
    color: "#eef2ff",
    background: "linear-gradient(180deg, #0b1020 0%, #111933 100%)",
    fontFamily: "\"IBM Plex Sans\", system-ui, sans-serif",
  },
  hero: {
    display: "grid",
    gap: 10,
    padding: 24,
    borderRadius: 24,
    background: "radial-gradient(circle at top left, rgba(246,114,128,0.24), rgba(55,146,255,0.14) 45%, rgba(13,22,40,0.92) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  muted: { color: "#9fb0d8", fontSize: 14 },
  cards: { display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  card: {
    display: "grid",
    gap: 10,
    padding: 16,
    borderRadius: 18,
    background: "rgba(8,14,28,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  list: { display: "grid", gap: 10, listStyle: "none", padding: 0, margin: 0 },
  item: {
    display: "grid",
    gap: 6,
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(246,114,128,0.18)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};

function useOverview(companyId?: string | null) {
  return usePluginData<{ overview: Record<string, number>; settings: Record<string, unknown> }>(
    DATA_KEYS.OVERVIEW,
    { companyId: companyId ?? undefined },
  );
}

function useTalents(companyId?: string | null) {
  return usePluginData<any[]>(DATA_KEYS.TALENTS, { companyId: companyId ?? undefined });
}

function useRequests(companyId?: string | null) {
  return usePluginData<any[]>(DATA_KEYS.REQUESTS, { companyId: companyId ?? undefined });
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div style={styles.card}>
      <strong>{label}</strong>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <span style={styles.muted}>{hint}</span>
    </div>
  );
}

function QuickActions({ companyId }: { companyId?: string | null }) {
  const toast = usePluginToast();
  const seedDemo = usePluginAction(ACTION_KEYS.SEED_DEMO);
  const createRequest = usePluginAction(ACTION_KEYS.CREATE_REQUEST);
  const [busy, setBusy] = useState<string | null>(null);

  async function runDemoSeed() {
    setBusy("seed");
    try {
      await seedDemo({ companyId: companyId ?? undefined, companyName: "AI Influencer & Spokesperson Company" });
      toast({ tone: "success", title: "Demo service request seeded" });
    } catch (error) {
      toast({ tone: "error", title: "Seed failed", body: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(null);
    }
  }

  async function runSampleRequest() {
    setBusy("request");
    try {
      await createRequest({
        companyId: companyId ?? undefined,
        companyName: "AI Influencer & Spokesperson Company",
        title: "Launch spokesperson SaaS explainer campaign",
        objective: "Create a reusable spokesperson package for sales demos, paid ads, and onboarding video.",
        targetAudience: "Growth leaders, founders, and category buyers",
        targetChannels: ["paid social", "landing pages", "webinars"],
        markets: ["Norway", "UK"],
        languages: ["English", "Norwegian"],
        productSummary: "Synthetic talent SaaS with governed approvals and reusable delivery packages.",
        claimSensitivity: "standard brand and disclosure-sensitive",
        budgetBand: "€8k-€15k monthly",
        prohibitedClaims: ["No deceptive impersonation", "No unapproved regulated claims"],
        preferredTalentMode: "either",
      });
      toast({ tone: "success", title: "Sample request created" });
    } catch (error) {
      toast({ tone: "error", title: "Request failed", body: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button style={styles.button} disabled={busy !== null} onClick={() => void runDemoSeed()}>
        {busy === "seed" ? "Seeding..." : "Seed Demo Request"}
      </button>
      <button style={styles.button} disabled={busy !== null} onClick={() => void runSampleRequest()}>
        {busy === "request" ? "Creating..." : "Create Sample Brief"}
      </button>
    </div>
  );
}

function TalentList({ talents }: { talents: any[] }) {
  return (
    <ul style={styles.list}>
      {talents.map((talent) => (
        <li key={talent.id} style={styles.item}>
          <strong>{talent.name}</strong>
          <span style={styles.muted}>{talent.archetype}</span>
          <span style={styles.muted}>{talent.languages.join(" · ")} | {talent.channels.join(", ")}</span>
          <span style={styles.muted}>Trust {talent.performanceSummary.trustScore} | Conversion {talent.performanceSummary.conversionScore}</span>
        </li>
      ))}
    </ul>
  );
}

function RequestList({ requests }: { requests: any[] }) {
  return (
    <ul style={styles.list}>
      {requests.map((request) => (
        <li key={request.id} style={styles.item}>
          <strong>{request.title}</strong>
          <span style={styles.muted}>{request.status} · {request.budgetBand}</span>
          <span style={styles.muted}>{request.targetChannels.join(", ")} | {request.markets.join(", ")}</span>
          <span style={styles.muted}>Approvals: {request.requiredApprovals.join(", ") || "None"}</span>
        </li>
      ))}
    </ul>
  );
}

function AgencySurface({ companyId }: { companyId?: string | null }) {
  const overview = useOverview(companyId);
  const talents = useTalents(companyId);
  const requests = useRequests(companyId);

  if (overview.loading || talents.loading || requests.loading) {
    return <div style={styles.card}>Loading AI spokesperson agency surface…</div>;
  }

  return (
    <div style={styles.shell}>
      <section style={styles.hero}>
        <span style={styles.muted}>Synthetic talent SaaS for every company in the portfolio</span>
        <h1 style={{ margin: 0, fontSize: 34 }}>AI Influencer & Spokesperson Agency</h1>
        <p style={{ ...styles.muted, maxWidth: 820 }}>
          Governed intake, talent matching, disclosures, approvals, delivery packages, and performance learning for synthetic spokesperson systems.
        </p>
        <QuickActions companyId={companyId} />
      </section>

      <section style={styles.cards}>
        <StatCard label="Talent Profiles" value={overview.data?.overview?.talentCount ?? 0} hint="Reusable agency-owned spokesperson systems" />
        <StatCard label="Active Requests" value={overview.data?.overview?.activeRequestCount ?? 0} hint="Requests currently being classified, scoped, or fulfilled" />
        <StatCard label="Awaiting Approval" value={overview.data?.overview?.awaitingApprovalCount ?? 0} hint="Campaigns waiting on disclosure, claims, or likeness review" />
        <StatCard label="Delivered" value={overview.data?.overview?.deliveredCount ?? 0} hint="Finished packages returned to requesting companies" />
      </section>

      <section style={styles.cards}>
        <div style={styles.card}>
          <h2 style={{ margin: 0 }}>Talent Catalog</h2>
          <TalentList talents={talents.data ?? []} />
        </div>
        <div style={styles.card}>
          <h2 style={{ margin: 0 }}>Request Pipeline</h2>
          <RequestList requests={requests.data ?? []} />
        </div>
      </section>
    </div>
  );
}

export function AgencyPage({ context }: PluginPageProps) {
  return <AgencySurface companyId={context.companyId} />;
}

export function AgencyWidget({ context }: PluginWidgetProps) {
  const overview = useOverview(context.companyId);
  if (overview.loading) return <div style={styles.card}>Loading agency widget…</div>;
  return (
    <div style={styles.card}>
      <strong>AI Spokesperson Agency</strong>
      <span style={styles.muted}>{overview.data?.overview?.activeRequestCount ?? 0} active requests · {overview.data?.overview?.availableTalentCount ?? 0} available talents</span>
    </div>
  );
}

export function AgencySidebarLink({ context }: PluginSidebarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>Agency</span>
      <span style={styles.muted}>Synthetic talent SaaS</span>
    </div>
  );
}

export function AgencySettingsPage({ context }: PluginPageProps) {
  const settings = usePluginData<any>(DATA_KEYS.SETTINGS, { companyId: context.companyId ?? undefined });
  return (
    <div style={styles.shell}>
      <section style={styles.hero}>
        <h1 style={{ margin: 0 }}>Agency Policy Settings</h1>
        <p style={styles.muted}>These defaults keep disclosure, rights, and approval logic predictable across every requesting company.</p>
      </section>
      <pre style={{ ...styles.card, overflowX: "auto" }}>{JSON.stringify(settings.data ?? {}, null, 2)}</pre>
    </div>
  );
}

