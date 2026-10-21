# ControlProof AI: Product Spec (Phase 0 draft)

Status: **draft for founder review**. Last updated 2026-10-21.
Labels used in this document:
- **[FACT]** = verified in `RESEARCH.md`, with a source.
- **[HYPOTHESIS]** = needs customer interviews to confirm.
- **[DECISION]** = a product choice the founder can change.

## 1. The problem, in one line

A small defense subcontractor gets a contract with a CMMC or DFARS 252.204-7012 clause. They then have to work out which requirements apply, collect proof for each one, fix the gaps, and keep it all current. Today that means spreadsheets, consultants and scattered folders. **[HYPOTHESIS]**

The promise: **know which requirements apply, what evidence is missing, who must fix it, and when the work is complete.**

## 2. Who it's for (first niche)

**[HYPOTHESIS, to be validated in interviews]**
- U.S. defense subcontractors with **10–100 employees**.
- Companies whose contracts require **CMMC Level 1 (Self)** or **Level 2 (Self)**. These are the only levels that can be required while Phase II is suspended (`RESEARCH.md` §2). C3PAO preparation is a "get ready for later" mode, not the core promise.
- No full-time compliance person. The owner, office manager or an outside MSP does the work.
- Many already work with an **MSP**. The MSP is a likely buyer or reseller (see `COMPETITORS.md`).

Not for (at first):
- Primes.
- Large contractors with a GRC team.
- Companies that need a CUI enclave. We are not one, and we partner instead.
- Level 3.

## 3. What we will NOT claim

These hold in every screen, export, email and ad:
- We never say an organization "is compliant" or "is certified". The software tracks status. Only an authorized assessor, or the company's own signed affirmation, makes that determination.
- We are not a C3PAO, a Registered Practitioner, a law firm or an auditor.
- We do not say we are authorized to store CUI, export-controlled data or classified data. **The MVP forbids uploading them** (see §6).
- No FedRAMP, SOC 2 or CMMC claims about our own platform until that exact status exists.
- Progress numbers always show how they are calculated, and list what hasn't been assessed yet.

## 4. Statuses (exact list)

**Control assessment status:**
- Not assessed
- Needs review
- Evidence missing
- Evidence submitted
- Verification pending
- Gap identified
- Remediation in progress
- Evidence verified
- Review expired

Rules:
- Only a person with the **Reviewer** or **Admin** role can set "Evidence verified".
- AI and automation can *suggest* a status. They can never set one.
- "Review expired" is set automatically when an evidence item's review date passes. This is the only status the system sets by itself, and it can only move a control *away from* "verified".

**Applicability decision:**
- Awaiting review
- Confirmed (with rationale)
- Not applicable (with rationale, required)

## 5. Users and roles [DECISION]

| Role | Can do |
|---|---|
| Owner | Everything, including billing and deleting the organization |
| Admin | Manage members, confirm applicability, verify evidence, close gaps |
| Reviewer | Verify evidence, approve gap closure. Cannot manage members |
| Contributor | Add evidence, update assigned tasks. Cannot verify their own evidence |
| Viewer (read-only) | See everything in the organization, change nothing (e.g., an outside assessor or consultant) |
| Partner (MSP, Phase 5) | Has one of the roles above in several client organizations. Never cross-organization data in one view without per-organization authorization checks |

**Separation of duties:** the person who uploaded a piece of evidence cannot be the one who verifies it. An Owner can override this, and every override is recorded.

## 6. Data-classification boundary (MVP)

**[DECISION, see `ARCHITECTURE.md` §4 and `RESEARCH.md` on DFARS 7012 cloud rules]**

The MVP stores **evidence metadata by default, not evidence files**:
- **Evidence locator (default):** the title, what it proves, owner, date, review date, and *where it lives*. For example: "SharePoint GCC High > Policies > AC-Policy-v3.pdf". The real file stays in the customer's own compliant system.
- **File upload (opt-in, per organization):** only for documents the uploader confirms contain **no CUI, no export-controlled technical data and nothing classified**. Examples: a training sign-in sheet, a screenshot of an MFA setting with names removed, a vendor contract summary. The uploader must tick an attestation on every upload, and the attestation is logged.
- The **System Security Plan (SSP)** and **network diagrams** are often sensitive and may be marked CUI. The MVP treats them as **locator-only**. **[NEEDS LEGAL/ASSESSOR REVIEW]**

Why: a cloud service that stores CUI for a defense contractor may need to meet FedRAMP Moderate or an equivalent standard. That review is separate and expensive (see `RESEARCH.md`). The locator model lets us be useful without holding the customer's most sensitive data, and that is also a selling point.

## 7. MVP user stories (Phases 1–2)

**Setup**
1. As an owner, I sign up, turn on MFA and create my organization.
2. I answer a short profile: employees, locations, whether I hold DoD contracts, which clauses appear in them (DFARS 252.204-7012, -7019, -7020 or its RFO replacement 252.240-7997, 252.204-7021; FAR 52.204-21 or its RFO replacement 52.240-93; "don't know"). Clause numbers are changing under the RFO deviations, so we ask; we never assume (see `RESEARCH.md` §3), whether CUI is involved ("yes", "no", "don't know"), and what level a solicitation named.
3. I get a **proposed** applicability list (for example, "CMMC Level 2: likely, because you said clause 7021 with Level 2 appears"). Each item shows *why*, and starts as "Awaiting review". An Admin confirms it or rejects it with a reason.
4. I describe my **assessment scope** in plain words: the systems, locations and people that handle CUI. I can list "out of scope" items with reasons.

**Requirements**

5. I see the requirements for the framework version that applies. For example, NIST SP 800-171 Rev 2 for CMMC Level 2; see `RESEARCH.md` for which revision applies. Each requirement has:
   - its ID and official text, or a summary where reproduction isn't allowed;
   - the source link;
   - plain-English guidance, labeled "ControlProof guidance, not official".
6. I can filter by family, status, owner and "needs attention".

**Evidence**

7. For each requirement I add one or more evidence items, either as a locator or as an allowed upload.
8. Each evidence item has an owner, a "what this proves" note, a collected date and a review-by date.
9. A Reviewer marks an item "Verification pending" → "Evidence verified" or "Rejected (reason)".
10. I can download an **evidence inventory** (CSV and PDF).

**Gaps and remediation**

11. When a requirement isn't met, I create a gap with the reason, an owner, a due date and a priority. If the gap goes on a POA&M, I flag that it may need to be POA&M-eligible under the CMMC rules.
12. Owners update tasks. Each update is kept in history.
13. A gap closes only when a Reviewer approves it with linked evidence.

**Export**

14. I generate an **assessment package** (PDF and CSV/JSON) with:
    - organization profile;
    - framework and version;
    - every requirement and its status;
    - evidence index, showing *submitted* separately from *verified*;
    - open gaps and corrective actions;
    - timestamps and source links;
    - a **limitations** page.
15. The export says: "Prepared with ControlProof AI. This is not an assessment, certification or legal opinion."

**Dashboard**

16. Progress shows: verified ÷ applicable requirements, with the method written out, and how many are still **not assessed**.
17. Next recommended action, overdue tasks, evidence expiring within 30 days, and recent regulatory updates.

## 8. Out of scope for the MVP

- Integrations that pull evidence automatically from M365, Google, AWS and similar (Phase 3+, after interviews tell us which ones matter).
- Calculating the SPRS score. Maybe a "draft score worksheet" later, clearly labeled; the official score goes into SPRS by the company.
- Submitting anything to SPRS, DIBNet or any government system. **Never automated.**
- AI features (Phase 3).
- Billing (Phase 5). The pilot is invoiced by hand.
- Several frameworks at once. One framework family at a time to start: CMMC and NIST 800-171.

## 9. Interview script (10 questions)

Run with 10 small defense contractors and 5 MSPs or consultants. Record answers in `INTERVIEWS.md` (to be created). No recording without consent.

1. Which cybersecurity clauses or CMMC levels appear in your current contracts or recent solicitations? (Ask them to check, not guess.)
2. Do you handle CUI? How do you know, and who decided?
3. Where does your compliance work live today: spreadsheets, a consultant, a tool? Which tool, and what does it cost per year?
4. Walk me through the last time a prime or the DoD asked you for proof of security. How long did it take, and who did it?
5. What's the most painful, repetitive part? (Listen for evidence collection, the SSP, POA&M tracking, staff training records, MSP coordination.)
6. What have you already spent on consultants, tools or an assessment? What did you get?
7. If you use an MSP, what do they handle, and what falls back on you?
8. What would a vendor need to show you before you'd put compliance information in their system? (SOC 2? FedRAMP? "We don't store your files"?)
9. Who would approve buying a tool like this, and what's the budget range?
10. If we ran a 60-day paid pilot for **$[X]**, would you join now? What would make it a "no"?

Go/no-go signals are in `IMPLEMENTATION_PLAN.md` §1.
