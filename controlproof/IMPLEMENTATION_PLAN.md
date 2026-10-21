# ControlProof AI: Implementation Plan (Phase 0 draft)

Status: **plan only, nothing built**. Each phase needs the founder's go-ahead. Last updated 2026-10-21.

## 1. Go / no-go criteria (end of Phase 0 validation)

**Proceed to Phase 1 only if all of these are true:**
1. **Interviews:** at least **8 of 10** small defense contractors confirm a current or expected CMMC or DFARS 7012 obligation, with the clause seen in a contract or solicitation, not assumed.
2. **Pain:** at least **5** describe evidence collection, POA&M tracking or MSP coordination as a repeated, costly task (hours per month or consultant dollars stated).
3. **Money:** at least **3** organizations (contractors or MSPs) agree to a **paid pilot** (suggested $300–$500 for 60 days, invoiced by hand) or sign a letter of intent with a price.
4. **Trust:** the locator-only / no-CUI design is acceptable to at least half of the pilot candidates. If most insist on storing the SSP or CUI in the tool, **stop and re-plan** around a FedRAMP-authorized host or a partnership.
5. **Market:** no competitor already offers the same thing at or below our planned price to the same buyer, with no complaints we can fix (see `COMPETITORS.md`).

**Narrow the scope** if pain is real but only for one slice. For example: POA&M tracking only, a Level 1 annual affirmation helper only, or an MSP multi-client evidence tracker only.

**Stop** if fewer than 2 will pay, or the main need is CUI storage we can't safely provide.

## 2. Phases and acceptance criteria

### Phase 1: Secure foundation (about 3–4 weeks of build)
Build:
- New private repo, Next.js + TypeScript, CI (lint, typecheck, unit tests, `npm audit`)
- Auth with a managed identity provider; MFA for Owner, Admin and Reviewer
- Organization creation, invitations, memberships and roles (`DATA_MODEL.md` §1 and §8)
- Migrations for identity, tenancy and audit; RLS policies
- `audit_events` with hash chain
- Evidence metadata and private S3 with presigned URLs (locator default; uploads behind the org setting)
- Synthetic seed data
- Our own incident-response plan (one page)

Exit gate (all verified, results recorded in `TEST_REPORT.md`):
- [ ] Spec items 1 and 2: register, create org, and server-side access enforced
- [ ] Tenant-isolation suite passes (every endpoint, files, DB-level probe)
- [ ] No secrets in the repo (scanner clean)
- [ ] Staging deployed from `main` with documented rollback
- [ ] Restore-from-backup rehearsed once on staging

### Phase 2: Compliance workflow (about 4–6 weeks)
Build:
- Catalog loader (reviewed JSON → `framework_versions` / `requirement_versions`) for the revision that `RESEARCH.md` confirms applies; prior versions preserved
- Applicability proposals and decisions with rationale
- Scopes and assessments pinned to a catalog version
- Control assessment statuses, evidence linking, reviewer verification, separation of duties
- Gaps and remediation with history; closure requires verified evidence
- Dashboard with a transparent progress method
- Exports (PDF + CSV/JSON) with a limitations page
- Expiry job ("Review expired")
- Mobile layout checked at 375px

Exit gate: Definition-of-done items 1–10, 13, 14, 16 and 18. **Pilot with 3 design partners on staging-grade production.**

### Phase 3: AI assistance (about 3–4 weeks; only after pilot feedback asks for it)
Build:
- Explain a control
- Suggest evidence
- Draft a remediation plan
- Extract metadata from non-CUI uploads (opt-in per org)

All of it goes to `ai_suggestions`, cites catalog IDs and needs a human to accept. Add prompt-injection test cases.

Exit gate: Definition-of-done items 11 and 12. Adversarial tests show no state change from AI output, and no cross-org data in prompts.

### Phase 4: Regulatory intelligence (about 2–3 weeks)
Build:
- Official-source monitor and snapshots
- Diffs and the human review queue
- New catalog versions
- Opt-in re-assessment offers
- Relevant-only notifications

Exit gate: Definition-of-done item 13 proven with a simulated rule change.

### Phase 5: Commercial launch
Build:
- Stripe Billing
- Onboarding
- Help docs
- ToS, privacy policy and DPA reviewed by counsel
- An external penetration test
- Backup and restore drill
- MSP partner pricing
- A plan to decide on SOC 2

**No CUI capability** in any phase without the separate architecture and authorization review.

## 3. What the founder does vs. what Claude Code does

| Task | Founder | Claude Code |
|---|---|---|
| Interviews, pilots, pricing calls | ✔ | prepares scripts and summaries |
| Create accounts (Render, AWS, identity provider, email) and enter payment details | ✔ (Claude never does this) | writes step-by-step instructions |
| Paste secrets into Render env vars | ✔ | lists exact variable names |
| Code, tests, migrations, docs | reviews | ✔ |
| Approve each deploy and each phase | ✔ | reports verified test results first |
| Legal and assessor questions | ✔ (engages counsel or a Registered Practitioner) | drafts the questions |

## 4. Immediate next steps (this week)

1. Founder reads `RESEARCH.md` §Summary and `COMPETITORS.md` §Opportunities.
2. Founder books **5 contractor + 2 MSP** conversations (sources in `COMPETITORS.md` §Channels).
3. Claude Code prepares a **clickable demo** (static, synthetic data, no backend) showing "missing control → assigned fix → evidence package", for interviews. **Only if the founder approves.**
4. Re-check `RESEARCH.md` items marked Medium/Low confidence before any public claim.
