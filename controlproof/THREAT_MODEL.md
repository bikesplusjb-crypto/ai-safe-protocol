# ControlProof AI: Threat Model (Phase 0 draft)

Status: **draft**, to be revisited at every phase exit. Method: STRIDE per component, plus OWASP Top 10 (2021) and the OWASP Top 10 for LLM Applications for the AI features. Last updated 2026-10-21.

## What's worth stealing or breaking

| Asset | Why it matters |
|---|---|
| A customer's gap list and remediation tasks | It's a map of their security weaknesses. To an attacker, it's a target list for that defense supplier. **Treat as highly sensitive even though it isn't CUI.** |
| Evidence files and locators | They may show system names, configs and people |
| Assessment exports | Self-contained copies of the above |
| Audit log | Proof of who did what. If it's tampered with, trust is gone |
| Catalog and regulatory review | If corrupted, customers get the wrong requirements |
| Founder and admin accounts, cloud keys | They give access to everything |

## Threats and mitigations

| # | Threat | STRIDE / OWASP | Mitigation | Residual risk |
|---|---|---|---|---|
| T1 | User in org A reads or changes org B's data by changing an ID | Info disclosure, Elevation; A01 Broken Access Control | Single authorization guard, `org_id`-scoped queries, Postgres RLS backstop, composite foreign keys, 404 on cross-tenant access, **tenant-isolation test suite as a release gate** | A new endpoint added without the guard. Mitigated by a CI lint rule and review checklist |
| T2 | Leaked or guessed presigned file URL | Info disclosure | 5-minute expiry, random keys with no filenames, issued only after authorization, no public bucket, S3 access logs | A URL shared within 5 minutes still works. Accepted |
| T3 | Account takeover (phishing, password reuse) | Spoofing; A07 | Managed identity provider, **MFA required for Owner, Admin and Reviewer**, session timeout, new-device email, rate-limited login | Phishing of MFA codes. Offer passkeys |
| T4 | Customer uploads CUI or classified data despite the rules | Compliance / legal | Locator-only default, per-upload attestation (logged), clear warnings on screen, ToS ban, quick-delete process. **We do not scan file contents in the MVP** | Can't be fully prevented. Documented incident playbook: isolate the object, notify the customer, consult counsel. **Needs legal review** |
| T5 | Insider or support misuse | Info disclosure | No product superuser; break-glass access is time-boxed, logged and shown to the customer; least-privilege cloud IAM; MFA on cloud consoles | A single founder holds root keys. Use hardware MFA and keep a documented recovery |
| T6 | Audit log tampering | Tampering, Repudiation | App database role is INSERT-only on `audit_events`, per-org hash chain, nightly verification, backups | Database owner role could rewrite rows. Off-site daily export of chain heads |
| T7 | Malicious file (malware, oversized, HTML/SVG XSS) | A03 Injection | Size and type limits set at signing, served with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`, never rendered inline, no image processing in the MVP | Malware passes through to another user's download. Consider AV scanning before allowing uploads beyond the pilot |
| T8 | XSS / CSRF in the app | A03, A01 | React escaping, no `dangerouslySetInnerHTML` on user content, markdown sanitized, strict CSP, SameSite cookies, server actions with origin checks | Low |
| T9 | Injection (SQL) | A03 | ORM / parameterized queries only; no string-built SQL | Low |
| T10 | Secrets in git or logs | A05, A09 | Render env vars, GitHub secret scanning, Sentry PII scrubbing, log allow-lists | Low |
| T11 | Vulnerable dependency | A06 | Dependabot, lockfile, `npm audit` in CI, monthly update window | Zero-days |
| T12 | Data loss | Availability | Managed Postgres point-in-time recovery, daily logical backup to a separate bucket and account, S3 versioning, **quarterly restore test** (logged) | Single region during the MVP |
| T13 | Denial of service / cost blow-up | DoS | Rate limits per user and IP, upload quotas per org, AI token budgets per org (Phase 3) | Large-scale DDoS. Rely on the host's protection |
| T14 | Prompt injection in uploaded documents makes the AI leak or change data (Phase 3) | LLM01, LLM02, LLM06 | AI has no state-changing tools; one org's data per call; document text fenced as untrusted; outputs are suggestions only; citations must point to catalog IDs that exist; output encoding | Wrong or misleading suggestions. Human review is mandatory and the UI says so |
| T15 | Wrong regulatory information shown as fact | Integrity / liability | Official sources only; human-reviewed changes; versioned catalog; "last verified" date shown on every requirement; disclaimers | Reviewer error. Get a second reviewer for high-impact changes |
| T16 | Customer treats the progress % as certification | Liability | Wording rules in `PRODUCT_SPEC.md` §3, method shown, limitations page in every export | Misuse. ToS and counsel review |
| T17 | Billing / Stripe webhook spoofing (Phase 5) | Spoofing | Verify webhook signatures; never trust client-side plan state | Low |

## Our own platform's security claims (allowed wording)

- Allowed: "Encrypted in transit and at rest", "MFA required for admins", "Tenant isolation tested on every release", "We don't need your CUI: evidence can stay in your own systems". **Each only once true and tested.**
- Not allowed until achieved: SOC 2, FedRAMP, CMMC, "CUI-ready", "GovCloud", "military-grade".

## Known gaps at Phase 0

1. There is no independent penetration test yet. One is planned before commercial launch (Phase 5).
2. There is no SOC 2 report. Many buyers will ask for one; see `COMPETITORS.md` on trust barriers.
3. Incident-response plan for our own platform: not yet written. It is due in Phase 1.
4. The contract and ToS liability caps have not been reviewed by counsel.
