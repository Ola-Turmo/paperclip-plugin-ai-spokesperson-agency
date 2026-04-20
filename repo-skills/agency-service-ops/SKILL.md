---
name: agency-service-ops
description: Use for company-8 and plugin work where the task involves AI spokesperson or influencer service intake, talent matching, approvals, disclosures, rights, delivery packaging, or performance feedback across portfolio companies or external SaaS clients.
---

# Agency Service Ops

Use this skill when working on the AI Influencer & Spokesperson Company service bridge and operating model.

## Read First

Read these files in order:

1. `README.md`
2. `src/manifest.ts`
3. `src/worker.ts`

Then inspect the relevant UI or state surface:

- UI: `src/ui/`
- worker logic and data flow: `src/worker.ts`
- reproducible sales assets: `scripts/`, `assets/`

## What This Repo Owns

This repo is the governed agency bridge for:

- talent discovery
- request intake
- risk and disclosure classification
- scoped work-order creation
- approvals and rights handling
- delivery packages
- performance feedback

## Working Rules

- Optimize for service clarity, not unrestricted talent access.
- Preserve company boundaries between requester and agency.
- Make the safe path the easy path.
- Treat disclosures, likeness, sponsorship, and regulated claims as product features, not footnotes.

## Non-Negotiable Guardrails

- Original synthetic talent is the default.
- Founder-likeness or real-person-derived use requires stronger review.
- Rights and usage boundaries must ship with deliverables.
- High-trust categories require escalation, not quiet convenience.

## Default Workflow

1. Identify the service step being touched.
   Catalog, intake, classification, work order, approvals, delivery, or feedback.

2. Check whether the change affects safety posture.
   Disclosure, endorsement, regulated claims, live AI use, or multi-market rollout.

3. Keep the requesting-company experience simple while preserving agency governance.

4. Verify both the operator story and the SaaS story.
   The feature should work for internal portfolio use and still make sense as a client-facing managed service.

## Expected Outcomes

Good work in this repo should improve:

- intake quality
- approval safety
- delivery clarity
- cross-company service usability
- reusable SaaS packaging
