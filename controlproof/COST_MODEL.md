# ControlProof AI: Cost Model (Phase 0 estimate)

Status: **estimate**. All prices were read from vendor domains via web search on **2026-10-21**. Direct page fetches failed through this environment's proxy, so **re-check each price on the vendor's page before committing spend**. **[unconfirmed]** marks figures where sources disagreed or the plan name wasn't visible.

## 1. Unit prices (as found 2026-10-21)

| Item | Plan | Price | Source |
|---|---|---|---|
| Render workspace | Hobby / Pro / Scale | $0 / $25 / $499 per month | render.com/changelog/updated-plans-for-render-workspaces |
| Render web service | Starter / Standard | $7 / $25 per instance per month | render.com/pricing |
| Render worker | from Starter | $7 per month **[unconfirmed for workers]** | render.com/docs/service-types |
| Render cron | per-second | $1 per month minimum | render.com/pricing |
| Render Postgres | 256 MB / 1 GB tiers | $6 / $19 per month, plus storage $0.30 per GB-month **[tier names unconfirmed]** | render.com/pricing |
| Supabase | Pro | $25 per org per month (includes 8 GB disk, 100 GB file storage, 100k MAU). **SOC 2 report needs the Team plan or higher** (price not retrieved) | supabase.com/docs |
| AWS S3 Standard (us-east-1) | — | $0.023 per GB-month; $0.005 per 1k PUT; $0.0004 per 1k GET | aws.amazon.com/s3/pricing |
| AWS GovCloud S3 | — | **not published in the results; AWS says prices vary by region** | docs.aws.amazon.com/govcloud-us |
| Clerk | Pro | $25 per month ($20 billed annually), MFA included, 50k retained users | clerk.com/pricing |
| WorkOS | AuthKit / SSO | $0 up to 1M MAU / $125 per SSO connection per month | workos.com/pricing |
| Auth0 | B2B Essentials | $150 per month for 500 MAU **[unconfirmed, 2023 figure]** | auth0.com |
| Postmark | Basic | $15 per month for 10k emails | postmarkapp.com/pricing |
| Resend | Free / Pro | $0 (3k per month) / $20 (50k per month) | resend.com/pricing |
| Stripe | cards / Billing | 2.9% + 30¢ per charge / 0.7% of billing volume | stripe.com/pricing |
| Claude API | Sonnet 5.5 | $2 input / $10 output per million tokens | platform.claude.com pricing |
| Claude API | Haiku 5.5 | $0.10 / $0.50 per million tokens (prompts ≤100k tokens) | platform.claude.com |
| Sentry | Team | ~$29 monthly / $26 billed annually | sentry.io/pricing |
| Better Stack | Free | $0 (10 monitors) | betterstack.com |
| Dependabot / Snyk | Free | $0 (Snyk: limited tests per month) | GitHub docs / docs.snyk.io |

## 2. Monthly running cost

**Assumptions:**
- About 10 pilot organizations, 50 users, 20 GB of files.
- About 2M AI tokens a month (Phase 3+).
- Render hosting, S3 files, Clerk auth, Postmark email.

| Line | Pilot (Phases 1–2) | With AI (Phase 3+) |
|---|---|---|
| Render Pro workspace | 25 | 25 |
| Web service (Standard) | 25 | 25 |
| Worker (Starter) + cron | 8 | 8 |
| Postgres 1 GB + 10 GB storage | 22 | 22 |
| S3 storage + requests | ~1.40 | ~1.40 |
| Clerk Pro (MFA) | 25 | 25 |
| Postmark Basic | 15 | 15 |
| AI (Sonnet 5.5, 1.5M in / 0.5M out) | 0 | 8 |
| Sentry Team | 29 | 29 |
| **Total** | **≈ $150 / month** | **≈ $158 / month** |

- **Leanest version:** Hobby workspace, Starter web service, smallest database, free email tier, Sentry billed annually comes to about **$90–100 a month**.
- **Supabase instead of Render + S3 + Clerk:** Supabase Pro at $25 replaces about $70. But its SOC 2 report needs a higher plan, and the founder already uses Supabase for marketing, so it would need a **separate project**.

## 3. One-time and yearly costs (not in the monthly figure)

| Item | Estimate | Basis |
|---|---|---|
| Lawyer: ToS, privacy policy, DPA, liability language | **unknown; get 2 quotes** | Required before Phase 5 |
| Registered Practitioner / assessor review of our wording and exports | **unknown; get quotes** | Recommended before marketing to contractors |
| External penetration test | **unknown; get quotes** | Before Phase 5 |
| SOC 2 Type I audit | $7.5k–$20k (vendor-published: Drata, Secureframe) | Many B2B buyers ask for it |
| SOC 2 Type II, first year total | $25k–$50k+ (vendor-published: Drata, Vanta) | Usually year 2 |
| FedRAMP (only if we ever store CUI) | **no published cost.** FedRAMP 20x "Class C" pipeline opened Aug 31, 2026 per fedramp.gov (**re-verify**) | Out of scope for the MVP |
| Insurance (tech E&O + cyber) | **unknown; get quotes** | Strongly advised before paid customers |

## 4. Unit economics (hypothesis)

- Pilot price $300–$500 for 60 days: 3 pilots cover about 6–10 months of hosting.
- At the **$299/month** hypothesis, about 1 customer covers hosting. Support time, legal and insurance are the real costs.
- Stripe takes about 3.6% (card fee + Billing). At $299/month that's about $11 per customer per month.
- **Biggest cost risk:** trust requirements (SOC 2, pen test, insurance) of **$30k–$60k+ in year one** before larger contractors or MSPs will buy. The pilot should find out whether small contractors require these up front.
