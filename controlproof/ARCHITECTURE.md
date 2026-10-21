# ControlProof AI: Architecture (Phase 0 recommendation)

Status: **recommendation for founder review**. Nothing here has been built or deployed. Last updated 2026-10-21.

## 1. What exists today (inspected 2026-10-21)

| Asset | What it is | Relevance |
|---|---|---|
| `bikesplusjb-crypto/ai-safe-protocol` | One static `index.html` (AI Safe Protocol marketing site): an 18-control self-assessment run in the browser, a Supabase email capture and threat-feed read, and Gumroad product links | Same founder, a different product. A possible marketing channel, but **not a code base to build the SaaS on**: no build system, no server, no auth, no tests. |
| `bikesplusjb-crypto/next-app` | ZigZag Mind, a static PWA hosted on Render | Unrelated product. Shows the founder already has a **Render** account and a working deploy flow. |
| Supabase project (used by aisafeprotocol.com) | An existing project for email capture | **Do not reuse** for ControlProof. Use a separate project or database so marketing data and customer compliance data never share a tenant or keys. |

Recommendation: start ControlProof in a **new private repository** (e.g., `controlproof-app`) once Phase 0 gets a "go". These planning docs live in `ai-safe-protocol/controlproof/` on a separate branch only so nothing new is created without approval.

## 2. Recommended stack [DECISION, trade-offs below]

| Layer | Choice | Why | Main alternative |
|---|---|---|---|
| App | **Next.js (App Router) + TypeScript**, server components and server actions; all data access server-side | One codebase, one deploy, strong typing, large hiring pool | Remix; or SvelteKit (smaller ecosystem) |
| Database | **PostgreSQL 16** (managed) with **Drizzle ORM** and SQL migrations kept in git | Relational data with strict foreign keys; row-level security (RLS) available as a second safety net | Prisma (heavier, RLS harder) |
| Auth | **Managed identity provider** with MFA (TOTP/passkeys), org membership done in **our** database | Don't build password storage; MFA from day one | Clerk, WorkOS AuthKit, Auth0, or Supabase Auth (prices in `COST_MODEL.md`) |
| Files | **AWS S3** private bucket, **SSE-KMS** encryption, Block Public Access, 5-minute presigned URLs, object key = `org/<org_id>/<uuid>` (never the filename) | Mature, cheap, auditable; same API in GovCloud later | Supabase Storage / Cloudflare R2 |
| Hosting | **Render**: one web service, one background worker, managed Postgres | The founder already uses Render; simple deploys from GitHub | Vercel + Neon; AWS (more control, more ops work) |
| Jobs | Render background worker + cron (source monitoring, review-date expiry, email) | No extra queue service needed at MVP scale | — |
| Email | Transactional provider (Postmark or Resend) | Invitations, task reminders, password events | — |
| Errors and uptime | Sentry (PII scrubbing on) + an uptime monitor | Know about failures before customers do | — |
| AI (Phase 3) | Anthropic Claude API, server-side only | Strong document reasoning, citation-friendly | — |
| Payments (Phase 5) | Stripe Billing | After the pilot proves the workflow | Manual invoices during the pilot |

**What we're deliberately not doing:** no microservices, no Kubernetes, no client-side database access, no customer data in analytics tools.

## 3. Component and data-flow sketch

```
Browser (mobile + desktop)
   │  HTTPS only (HSTS), session cookie (HttpOnly, Secure, SameSite=Lax)
   ▼
Next.js web service (Render)
   ├─ authN: identity provider session → our user_id
   ├─ authZ: requireOrgRole(org_id, permission) on EVERY server action / route
   ├─ DB access: per-request transaction with SET LOCAL app.org_id, app.user_id (RLS backstop)
   ├─ Files: create presigned PUT (upload) / GET (5 min) URLs after authZ; browser talks to S3 directly
   └─ audit_events: append-only write for every state change
   ▼
PostgreSQL (managed, encrypted at rest, daily backups + point-in-time recovery)

Background worker (Render)
   ├─ review-date expiry → status "Review expired" + notifications
   ├─ regulatory source monitor → snapshot, hash, diff → regulatory_change_reviews (human review)
   └─ email outbox

S3 (private, KMS) ← presigned URLs only; no public objects; versioning on; lifecycle for deleted orgs
```

## 4. Security boundaries

1. **Data classification (MVP):** synthetic data and ordinary business documents only. CUI, export-controlled data and classified data are **prohibited**. This is enforced by:
   - Terms of service.
   - An upload attestation, logged every time.
   - Evidence-locator mode as the default, so the file stays in the customer's own system.
   - SSPs and diagrams treated as locator-only.
   - No AI processing of uploads until Phase 3, and only for organizations that opt in.

   A **separate review is required before any CUI capability** (see `RESEARCH.md` on DFARS 252.204-7012 cloud requirements and FedRAMP).
2. **Tenant boundary:** every tenant-owned row carries `org_id`, and authorization is checked in application code first. Postgres RLS policies then filter on `current_setting('app.org_id')` as a backstop. S3 keys are prefixed by org, and presigned URLs are issued only after the evidence row's `org_id` is checked against the caller's membership.
3. **Admin boundary:** no "superuser" view in the product UI. Founder or support access to customer data is break-glass: time-limited, logged in `audit_events` with a reason, and visible to the customer's Owner.
4. **AI boundary (Phase 3):**
   - AI calls carry one organization's data only.
   - Document text is wrapped and marked as untrusted data.
   - The model has **no tools** that change state.
   - Outputs are stored as `suggestions` that a human accepts or rejects.
   - Prompts and outputs are not logged in full by default.
   - The provider is chosen under terms where customer data isn't used for training (verify current terms before Phase 3).
5. **Secrets:** environment variables on Render only, never in git. `.env.example` lists names but no values. Secret scanning is on in GitHub.

## 5. Regulatory change monitoring (Phase 4)

- `regulatory_sources` lists official URLs and APIs only. Examples:
  - the Federal Register API document search for "Cybersecurity Maturity Model Certification";
  - the eCFR API for 32 CFR 170 and 48 CFR 252.204;
  - the NIST CSRC publication pages;
  - DoD CIO CMMC pages.
- The worker fetches each source on a schedule, stores a `source_snapshot` (content hash and normalized text), and diffs it against the last one.
- A change creates a `regulatory_change_review` with status `proposed`. A human reviewer writes the impact assessment, links the affected requirements, and approves or rejects.
- Approval can create a **new** `requirement_version`. It never edits an old one. Existing assessments keep pointing at the version they used. A migration offer ("re-assess against Rev X") is shown to customers, never applied silently.
- News articles and AI summaries can be attached as *context*, never as the trigger for an approved change.

## 6. Environments

| Env | Data | Who |
|---|---|---|
| local | synthetic seed data | developer |
| staging | synthetic only, separate database, bucket and keys | founder testing, demos |
| production | pilot customers (non-CUI) | after Phase 1 exit criteria and founder approval |

## 7. Open architecture questions

1. Is GovCloud or FedRAMP-authorized hosting needed even for **metadata only**? (Probably not, if no CUI is stored, but **this needs assessor or legal review**; see `RESEARCH.md`.)
2. Should MSP partners get one login across their client organizations (Phase 5)? The design supports it through memberships, but it raises the cost of a breach. Decide after the MSP interviews.
3. Use the identity provider's organizations feature, or our own `organization_memberships` table? Recommendation: **ours**, so authorization logic lives in one place we test.
