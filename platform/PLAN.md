# AISafeProtocol Platform: Architecture and Implementation Plan (Phase 0)

Status: **proposal for founder approval**. Nothing has been built or deployed except the small security patch described in `AUDIT.md` §S1, which sits on a branch. Last updated 2026-10-22.

Labels:
- **[DECISION]** = needs the founder's yes or no.
- **[ASSUMPTION]** = to be validated.

## 1. Decisions the founder needs to make

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | How site changes go live (`main` auto-deploys) | **Same rule as ZigZag Mind.** All work on branches; `main` moves only when you send "Fast-forward main to commit X and push main." | Every push to `main` is instantly live |
| D2 | Where the app lives | New **private repo `aisafeprotocol-app`** (Next.js), deployed at **`app.aisafeprotocol.com`**. The current marketing page stays as-is until new marketing pages are ready inside the app; then the domain is switched over in one planned step | No risk to the live site while building; one codebase later |
| D3 | Database / auth / files | **New Supabase project** (Postgres + Auth + Storage + RLS) on the **Pro plan** ($25/mo, verify). It must not be the existing marketing project | One managed service the founder already knows. RLS gives database-level tenant isolation. Its SOC 2 report needs the Team plan, so revisit later |
| D4 | Wording on the current site (`AUDIT.md` S6) | Replace "STANDARD MET" / "certificate" with self-assessment wording, and add Privacy and Terms pages | The new principles say never imply certification |
| D5 | Gumroad products | Keep selling the $29 poster set and the $49 incident pack. **Pause the $499 Control Pack and $149 Renewal marketing** until the subscription replaces them, or offer existing buyers a free first year | Avoid selling a product you're about to replace |
| D6 | First module to build | **Module 2 (AI agents & automations)**, with Module 1 questions about the systems the agents use | It's the newest risk, the existing AGT controls give a head start, and SMBs are adopting agents fast **[ASSUMPTION; interviews decide]** |
| D7 | AI provider | Behind a replaceable interface; start with **Anthropic Claude**. AI is **off by default per organization** until the founder approves the data-processing terms and disclosure | Customer documents are sensitive |
| D8 | Prices | Keep **$49 / $149 / $299** as configurable plan settings, **not shown publicly until the pilot validates them** | The handoff calls them hypotheses |

## 2. Architecture

```
                         aisafeprotocol.com  (marketing; today: static index.html on Render)
                                   │  "Start your risk assessment"
                                   ▼
Browser (phone/desktop) ── HTTPS ──► app.aisafeprotocol.com   Next.js (TypeScript) on Render web service
                                       │  server-side only:
                                       │  · auth session (Supabase Auth, MFA for admins)
                                       │  · requireMember(org, permission) on every action
                                       │  · scoring engine (pure TypeScript, versioned, no AI)
                                       │  · AI service interface ─► provider (structured output + schema validation)
                                       │  · PDF report (server-rendered)
                                       │  · Stripe Checkout / Billing Portal / signed webhooks
                                       ▼
                              Supabase (new project)
                              · Postgres + Row-Level Security on every tenant table
                              · Storage: private bucket, path org/<id>/..., signed URLs (5 min)
                              · Auth (email + MFA; magic link)
                                       ▲
                    Render cron worker ┘  reassessment dates, evidence expiry, overdue actions → events + email
```

Key rules:
- **The scoring engine is a pure function:** `score(answers, controls, evidence, methodologyVersion) → result`. It's unit-tested and has no network or AI calls.
- **AI output is a draft.** It's stored as a suggestion that a person confirms or edits. It never writes scores, permissions, billing or statuses.
- **The browser never holds secrets:**
  - the Supabase *service* key lives only on the server;
  - Stripe secret keys are server-only;
  - the anon key is used only for auth.

## 3. MVP user flow (Phase 1: one module end to end)

1. Sign up → create organization (or a consultant workspace) → MFA prompt for owners.
2. **Add an AI asset:**
   - name, type (agent/automation, AI app, vendor AI service), owner, purpose in plain words;
   - the data, tools and systems it touches.
3. **New assessment → Module 2.** Adaptive questions, for example: "Can it send email?" → "Does a person approve before it sends?". Drafts save automatically and can be resumed.
4. **Capabilities: intended vs granted, captured separately.** The granted list is labeled "customer-reported" unless backed by an evidence file.
5. **Upload evidence** (policy PDF, permission screenshot). Optional AI extraction proposes facts; the user confirms or corrects each before it counts.
6. **Generate:** the engine creates risk records with:
   - inherent score (L×I);
   - residual score (methodology rules);
   - **confidence, completeness and freshness shown separately**;
   - "provisional" flags where evidence is missing.
7. **Review findings** → assign corrective actions (owner, due date).
8. **Export the PDF report** with methodology version, scope, evidence citations, gaps and limitations.
9. **Set a reassessment date.**

## 4. Scoring methodology v1 (deterministic)

- **Likelihood (1–5) and Impact (1–5)** come from question rules in the methodology file. Example: the agent can make irreversible payments → Impact 5. AI may *propose*; the person confirms.
- **Inherent = L × I** (1–25). **Default bands** (configurable per methodology version, not industry standards):
  - 1–4 Low
  - 5–9 Moderate
  - 10–16 High
  - 17–25 Critical
- **Control effectiveness:** each mapped control is rated *Not in place / Partial / In place*, and *In place* counts only when backed by evidence that hasn't expired.
- **Residual risk rule** (v1, explicit): each control reduces **likelihood or impact by a fixed step defined in the methodology** (e.g., "human approval before payment": impact −2). Residual can't go below 1 on either axis.
  - Controls **without evidence** give **no reduction**, and the risk is flagged "provisional".
  - **Missing answers never lower a score.** An unanswered question takes the worst plausible value defined by the methodology, and is flagged.
- **Shown separately:**
  - **Severity** (residual band).
  - **Evidence confidence:** verified, customer-provided, AI-extracted (unconfirmed), or none.
  - **Completeness:** answered ÷ applicable questions.
  - **Freshness:** age of the oldest evidence relied on.
- **Versioning:** every assessment stores `methodology_version`. Changing the methodology creates a new version. Old results are never recalculated silently, and re-scoring is an explicit "reassess under v2" action.

## 5. Data model (Phase 1 subset; Postgres + RLS)

Every tenant table has `org_id` and an RLS policy `org_id in (select org_id from org_members where user_id = auth.uid() and removed_at is null)`. Writes check the role as well.

| Table | Purpose |
|---|---|
| `organizations` (kind `business` \| `consultant_client`), `org_members` (role: owner, admin, assessor, contributor, viewer) | Tenancy. A consultant is just a member of each client org they've been invited to; **there is no automatic cross-org access** |
| `consultant_links` | Which client orgs a consultant firm manages (display only; access still comes from `org_members`) |
| `assets` | AI systems, agents, processes, robots (`module`, `owner`, `purpose`, `data_types`, `tools`, `intended_capabilities`, `granted_capabilities` + `granted_source`) |
| `methodology_versions` | Frozen JSON: questions, rules, controls, bands, step reductions |
| `assessments` | asset, module, methodology_version, status (draft/complete/superseded), started/completed |
| `assessment_answers` | question key, value, source (user/ai_extracted_confirmed), answered_by/at. **Append-only history** |
| `risks` | statement, cause, consequence, category, L, I, inherent, residual, band, confidence, completeness, freshness_days, provisional, owner, status, review_on |
| `risk_controls` | risk ↔ control, effectiveness, evidence links |
| `evidence_files`, `evidence_versions` | file metadata, storage path, sha256, uploader, label (customer_provided / ai_extracted / verified), review_by |
| `remediation_actions` | risk, owner, due, status, history |
| `monitoring_events`, `notifications` | change log ("answer changed", "evidence expired") → which risks need review |
| `audit_events` | append-only who / what / when (no document contents or secrets) |
| `ai_jobs` | operation, model, input refs (ids), token counts, cost, schema-valid?, status. **Cost per assessment comes from here** |
| `plans`, `subscriptions`, `entitlements` | Prices and limits **as data**, mirrored from Stripe by verified webhooks (idempotency key = Stripe event id) |

## 6. Security and tenant isolation (built in Phase 1, not later)

- RLS on every tenant table, **plus** a server-side `requireMember(org, permission)` check on every action. Neither replaces the other.
- **Automated tests:**
  - user in org A requests org B's assets, files, reports and signed URLs → nothing returned;
  - a consultant not invited to a client → nothing returned;
  - entitlement limits enforced on the server even with the UI bypassed;
  - a replayed Stripe webhook → no duplicate change;
  - prompt-injection documents → no state change.
- Uploads: allow-listed types (PDF, PNG, JPG, TXT, DOCX), 10 MB limit, private bucket, signed URLs, served as attachments.
- AI: document text is wrapped as untrusted data; the model has no tools; outputs are validated against JSON schemas; the per-organization AI setting is off by default.
- Rate limits on auth, uploads and AI calls; per-organization AI budget.
- Backups (Supabase daily + point-in-time recovery on Pro, verify); a restore drill before launch.
- Allowed security claims only once true. No SOC 2, ISO 42001 or "certified" claims.

## 7. Phases

| Phase | Builds | Exit check (verified, results in TEST_REPORT.md) |
|---|---|---|
| **0 (now)** | Audit, this plan, security patch S1 on a branch, competitor research, interview script | Founder decisions D1–D8 |
| **0.5 Validation** | Clickable **sample report** + 10-question demo (synthetic data) for interviews. 15–20 conversations | ≥5 willing to test, ≥3 serious paid-pilot talks, evidence of recurring need |
| **1 Foundation + one module** | Repo, auth, orgs, RLS, assets, Module 2 (+ core Module 1 questions), scoring engine, risk register, evidence upload, PDF, audit history, Stripe test mode | Acceptance criteria §15 of the handoff (functional + security + scoring rows) |
| **2** | Employee AI-use module, shared question framework, remediation tracking, comparisons, consultant workspaces | Consultant isolation tests |
| **3** | Scheduled reassessment, expiry alerts, changed-answer detection, notifications | Change → flagged risks → history preserved |
| **4** | Robot and physical AI module, with explicit "not a safety assessment" boundaries and qualified-engineer review | Reviewed by a qualified safety professional |
| **5** | Integrations (only validated ones) | Per-integration purpose, consent, error handling |

## 8. Costs (estimates; re-verify prices before signing up)

| Item | Monthly |
|---|---|
| Render web service (Starter $7 to Standard $25) + cron ($1 min) | $8–26 |
| Supabase Pro (DB + auth + storage, 100 GB files included) | $25 |
| Transactional email (Resend free or Postmark $15) | $0–15 |
| Sentry (errors) | $0–29 |
| AI (Claude: Sonnet $2/$10 per million tokens; Haiku $0.10/$0.50, per 2026-10-21 search) | about **$0.02–0.10 per assessment** with Haiku extraction and Sonnet drafting, about **$5–20/mo** at pilot scale **[ASSUMPTION: about 20–50k tokens per assessment]** |
| Stripe | 2.9% + 30¢ per charge + 0.7% Billing |
| **Total, pilot** | **about $40–120 / month** plus Stripe fees |

One-time costs to quote before launch: counsel (Terms, Privacy, DPA, claims review), a penetration test, E&O / cyber insurance, and a qualified safety reviewer before Module 4.

## 9. Interview script (15–20 people: consultants, security advisers, businesses running AI agents)

1. How do you assess AI risk today? Show me the last one.
2. What takes the most time?
3. What must you deliver to a client, board, insurer or auditor?
4. How often does it change or need redoing?
5. What tools or consultants do you pay for now, and how much?
6. Which AI agents or automations can take actions in your business (send, pay, delete)?
7. Who knows what each one is allowed to do?
8. *(Show the sample report.)* What's missing? What would you remove?
9. Would you pay $X/month for this, for your org or per client?
10. Would you join a paid 60-day pilot now?
