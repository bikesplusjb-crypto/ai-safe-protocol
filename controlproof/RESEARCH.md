# ControlProof AI: Regulatory Research (Phase 0)

**Research date:** 2026-10-21. **Last verified** = 2026-10-21 for every row unless stated otherwise.

**How this was researched (read first):**
- This environment's network proxy blocked direct page fetches. Every finding below comes from **web-search summaries of the listed pages**, not from reading the full page.
- Confidence labels:
  - **Med-Official:** the summary came from the official URL listed.
  - **Medium:** consistent law-firm or trade-press summaries.
  - **Low:** a single or conflicting secondary source.
  - **Nothing here is "High"** (read in full on the official page today).
- **Before any public claim or customer-facing requirement, a person must open each official URL and confirm it.** That task is in `IMPLEMENTATION_PLAN.md`.
- This is research, not legal advice. Questions for counsel are in §7.

## Summary: the five things that matter most

1. **CMMC Phase II (third-party C3PAO assessments) is suspended** (Med-Official).
   - Suspended by the Department of War (formerly DoD) on **2026-07-13**. Phase II was due 2026-11-10.
   - Only **Level 1 (Self)** and **Level 2 (Self)** can be required now.
   - Class Deviation **2026-O0025 Rev 3 (2026-09-03)** writes the pause into DFARS. Secondary sources say automatic CMMC clause insertion resumes after **2028-11-09** (Low).
   - The CMMC Reform Task Force report was reportedly delivered but **not published** as of mid-October (Low–Medium).
   - 32 CFR 170 and the DFARS CMMC rule have **not** been repealed.
2. **The control baseline is NIST SP 800-171 *Rev 2* (110 requirements)**, even though NIST published Rev 3 (2024-05-14) and marked Rev 2 withdrawn. DoD class deviations pin Rev 2 for DFARS 252.204-7012 and CMMC (Med-Official). **The product must ship Rev 2 as the active catalog and keep Rev 3 as a stored future version.**
3. **Clause numbers are changing** under the "Revolutionary FAR Overhaul" (RFO) deviations (Low–Medium, secondary):
   - 252.204-7019 removed.
   - 252.204-7020 becomes **252.240-7997** (no Basic self-assessment).
   - FAR 52.204-21 becomes **52.240-93**.

   Which obligations apply depends on **the clause text in each contract**. Onboarding must ask for clause numbers, never assume them.
4. **CIRCIA is still proposed.**
   - The final rule went to OMB review on **2026-10-01** (Medium, secondary). Publication is possibly within months; the effective date is unknown.
   - The 2024 proposal would cover **DFARS 7012 contractors regardless of size**, with 72-hour incident and 24-hour ransom-payment reports to CISA, separate from DIBNet unless a CISA–DoD agreement exists (none found).
5. **There is no binding federal AI compliance mandate on private small businesses** (High confidence that none was found).
   - NIST AI RMF is voluntary and being revised.
   - Colorado's AI Act was repealed and replaced by SB26-189, with duties from **2027-01-01**.
   - California ADMT regulations apply from 2027-01-01 to CCPA-covered businesses.

   AI governance stays an expansion idea, not a launch claim.

## 1. NIST SP 800-171 / 800-172

| Item | Status | Source | Confidence |
|---|---|---|---|
| SP 800-171 **Rev 3** final; 800-171A Rev 3 final | Published 2024-05-14. Rev 3 has 17 families and numbering `03.xx.xx`. Requirement count **97** (secondary, verify against the PDF) | https://csrc.nist.gov/pubs/sp/800/171/r3/final ; https://csrc.nist.gov/pubs/sp/800/171/a/r3/final | Med-Official / count Medium |
| SP 800-171 **Rev 2** | 110 requirements, 14 families. **Still contractually required by DoD** | 32 CFR 170.14; https://www.acq.osd.mil/dpap/policy/policyvault/USA001074-24-DPC.pdf (Class Deviation 2024-O0013 Rev 1) | Med-Official |
| Rev 2 pinned again | Class Deviation 2026-O0025 Rev 3 restates the Rev 2 baseline under 7012 | https://www.acq.osd.mil/dpap/dars/classdev/DFARS_RFO/Part-240/2026-O0025_Rev3_TAB_A_Deviation_Memo.pdf | Med-Official |
| Rev 2 → Rev 3 move for CMMC | Planned rule **RIN 0790-AM01** (interim final rule targeted around July 2026). **Not found published** | https://www.reginfo.gov/public/do/eAgendaViewRule?pubId=202510&RIN=0790-AM01 | Medium |
| SP 800-172 Rev 3 / 172A Rev 3 | Final **2026-05-13**. CMMC Level 3 still references 800-172 (Feb 2021), 24 selected requirements | https://csrc.nist.gov/pubs/sp/800/172/r3/final ; 32 CFR 170.14(c)(4) | Med-Official |
| Possible future revision | NIST "update status" page last updated 2026-06-09; no Rev 4 draft found | https://csrc.nist.gov/projects/protecting-controlled-unclassified-information/sp-800-171/update-status | Low |
| Reuse of text | NIST publications are generally U.S. government works. **Confirm** before loading full requirement text into the product | csrc.nist.gov | Not verified |

**Product implication:** catalog `NIST-800-171 r2` = active, `r3` = stored and inactive. Assessments pin a version. A migration offer appears only once a rule requires it.

## 2. CMMC (32 CFR Part 170; DFARS 252.204-7021 / -7025)

| Item | Detail | Source | Confidence |
|---|---|---|---|
| Program rule | 89 FR 83092, published 2024-10-15, **effective 2024-12-16** | https://www.federalregister.gov/documents/2024/10/15/2024-22905/cybersecurity-maturity-model-certification-cmmc-program | Med-Official |
| Acquisition rule (DFARS Case 2019-D041) | Published 2025-09-10, **effective 2025-11-10**. Clauses 252.204-7021, provision 252.204-7025 | https://www.federalregister.gov/documents/2025/09/10/2025-17359/ | Med-Official |
| Phase 1 | From 2025-11-10: Level 1 (Self) and Level 2 (Self) in solicitations. **In force** | 32 CFR 170.3(e) | Med-Official |
| Phase 2 | Level 2 (C3PAO) as an award condition from 2026-11-10. **Suspended 2026-07-13** | https://www.war.gov/News/Releases/Release/Article/4542329/ ; memo https://dowcio.war.gov/Portals/0/Documents/Library/ImplementingSuspensionCMMC-PhaseII.pdf | Med-Official |
| Phases 3–4 | 2027-11-10 / 2028-11-10. Covered by the suspension of "pending and future milestones" | same | Med-Official |
| Implementing memo | Only L1 (Self) or L2 (Self) may be designated. Active solicitations requiring C3PAO or DIBCAC are amended. No waivers during the review | DOPSR 26-P-1023 (link above) | Med-Official (summary) |
| FAQ | "All Phase I Level 1 and Level 2 self-assessment requirements remain firmly in place" | https://media.defense.gov/2026/Aug/26/2003986826/-1/-1/0/CYBERSECURITY%20MATURITY%20MODEL%20CERTIFICATION%20FAQS.PDF | Med-Official |
| Deviation 2026-O0025 Rev 3 | Signed 2026-09-03, supersedes Rev 2 (2026-07-16). 7021 inserted only when a level is specified, until 2028-11-09 (date Low) | acq.osd.mil (link in §1) | Med-Official / details Low |
| RFI on reforming CMMC | On SAM.gov; comments closed 2026-08-14; more than 1,100 received | defensescoop.com 2026-09-09 | Medium |
| **Level 1 (Self)** | 15 requirements (FAR 52.204-21(b)(1)(i)–(xv)); **annual** self-assessment and **annual affirmation** in SPRS; **no POA&M** | 32 CFR 170.15, 170.21 | Med-Official |
| **Level 2 (Self)** | 110 (800-171 Rev 2). Every 3 years plus **annual affirmation**; status lapses if an affirmation is missed. **Conditional** status at ≥80% (88/110 by arithmetic, verify) with only permitted items on the POA&M; **close within 180 days** | 32 CFR 170.16, 170.21, 170.22 | Med-Official; the list of items that can't go on a POA&M **not retrieved** |
| Level 2 (C3PAO) / Level 3 (DIBCAC) | As in the rule. **Cannot currently be designated** | 32 CFR 170.17–170.18 | Med-Official |
| Flow-down | 7021 flows CMMC to subcontractors at the level matching the FCI or CUI they receive. 7012(m) flows down safeguarding and reporting | DFARS clause text (not read today) | Medium |
| Affected population | Rule analysis: about **139,201** L1 Self entities; L2 C3PAO estimates conflict (8,350 vs 76,598 depending on table); about 3,380 L3. DFARS rule: **28,164** unique awardees | https://downloads.regulations.gov/DOD-2023-OS-0063-0003/content.pdf | Medium (verify tables) |
| Assessor capacity | About 107–117 authorized C3PAOs; 1,000+ certified assessors (mid-2026) | Cyber AB town-hall recaps (cyberab.org inaccessible) | Low–Medium |
| DoD cost estimate (L2 C3PAO, small entity) | About **$104,670 over 3 years**, excluding implementation | 89 FR 83092 regulatory impact analysis (cited second-hand) | Medium |

## 3. DFARS / FAR safeguarding clauses

| Clause | Key obligations | Source | Confidence |
|---|---|---|---|
| **DFARS 252.204-7012** | Adequate security (800-171, Rev 2 per deviation). Report cyber incidents **within 72 hours** at https://dibnet.dod.mil (needs a medium-assurance certificate). Submit malware to DC3. **Preserve images and data ≥90 days.** Cloud providers storing CUI must meet **FedRAMP Moderate or equivalent**. Flow-down in (m). Now prescribed at 240.370-5(c) under the RFO deviation. **Which clause version is current is unclear** (acquisition.gov change dated 2026-05-07 vs eCFR "MAY 2024") | https://www.acquisition.gov/dfars/252.204-7012 ; https://www.ecfr.gov/current/title-48/chapter-2/subchapter-H/part-252/subpart-252.2/section-252.204-7012 | Med-Official / version Low |
| FedRAMP "equivalent" | DoD CIO memo (Dec 2023): 100% of the Moderate baseline, assessed by a FedRAMP-recognized 3PAO, zero open POA&Ms. **SOC 2 does not count** | Secondary summaries (secureframe.com, summit7.us, kiteworks.com); memo not read | Medium |
| 252.204-7019 | Basic score notice. **Removed** under the RFO deviation (effective about 2026-02-01); still in older contracts | secondary (summit7.us, secureframe.com) | Low–Medium |
| 252.204-7020 | Basic, Medium and High assessments. Renumbered **252.240-7997** under the deviation, **without Basic** | acquisition.gov; part52.dev | Low–Medium |
| FAR 52.204-21 | 15 basic safeguarding requirements (FCI). Replaced by **52.240-93** under the RFO Part 40 deviations | https://www.acquisition.gov/sites/default/files/page_file_uploads/DoD_RFO_Deviation_Part-40.pdf | Med-Official / content Medium |
| FAR CUI rule | Proposed 2025-01-15 (90 FR 4278). Re-proposed in the RFO rule **2026-06-23** (FR doc 2026-12559): 800-171 **Rev 3** baseline, 72-hour reporting. Comments closed 2026-07-23. **No final rule; reportedly "on hold"** | https://www.federalregister.gov/documents/2026/06/23/2026-12559/ | Med-Official / "on hold" Low |
| DFARS Case 2023-D024 | Open (aligns 7012 with 800-172); report due extended to 2026-11-18 | https://www.acq.osd.mil/dpap/dars/opencases/dfarscasenum/dfars.pdf | Med-Official |

## 4. CISA CIRCIA (6 CFR Part 226)

| Field | Finding | Confidence |
|---|---|---|
| Source | NPRM https://www.federalregister.gov/documents/2024/04/04/2024-06526/ ; town halls notice https://www.federalregister.gov/documents/2026/02/13/2026-02948/ | Med-Official |
| Status | **Proposed.** Final rule sent to OMB/OIRA **2026-10-01**; not published. Statutory deadline (about Oct 2025) missed | Medium |
| Effective date | **Unknown.** No reports required until a final rule takes effect | Medium |
| Proposed duties | Covered incident report **72 h**; ransom payment **24 h**; supplemental reports; keep records 2 years | High (NPRM content) |
| Small defense contractor? | Proposed criterion covers contractors required to report incidents to DoD (7012) **regardless of size** | Medium–Low (final scope may change) |
| Overlap with 7012 | Exception only via a CISA "CIRCIA Agreement" with DoD. **None found.** Plan for two reports | Medium |

## 5. AI governance

| Item | Status | Source | Confidence |
|---|---|---|---|
| NIST AI RMF 1.0 (AI 100-1) | Voluntary, Jan 2023; **being revised** under the July 2025 AI Action Plan; no revised text found | https://www.nist.gov/itl/ai-risk-management-framework | High / Medium |
| NIST AI 600-1 (GenAI profile) | Final, voluntary, 2024-07-26 | nist.gov | High |
| Cyber AI Profile (NIST IR 8596) | Preliminary draft only (2025-12-16) | https://csrc.nist.gov/pubs/ir/8596/iprd | Medium |
| COSAiS (SP 800-53 overlays for AI) | In development (IR 8605 series outline, Jan 2026) | https://csrc.nist.gov/Projects/cosais | Medium |
| Federal posture | EO 14179 (Jan 2025); OMB M-25-21 / M-25-22 bind **agencies only**; AI Action Plan (2025-07-23); EO 14365 (2025-12-11) targets state AI laws for preemption. **No binding federal AI mandate on private small businesses** | whitehouse.gov; federalregister.gov 2025-23092 | High |
| Colorado | SB24-205 **repealed and replaced** by **SB26-189** (signed 2026-05-14); duties from **2027-01-01**; draft rules out for comment to 2026-10-26 | https://leg.colorado.gov/bills/sb26-189 ; https://coag.gov/ai/ | Medium–High |
| Texas TRAIGA (HB 149) | Effective 2026-01-01; narrow, intent-based duties for private businesses | capitol.texas.gov | High (date) |
| California CPPA regulations | ADMT duties from **2027-01-01**; risk assessments from 2026; cybersecurity audits 2028–2030 by revenue (CCPA-covered businesses only) | https://cppa.ca.gov/regulations/ccpa_updates.html | High |

## 6. Other frameworks (ranked for later modules)

| Rank | Framework | Status | Applies to | Confidence |
|---|---|---|---|---|
| 1 | **CIRCIA add-on** for the same customers | Proposed (see §4) | 7012 contractors (proposed) | Medium |
| 2 | **FTC Safeguards Rule** (16 CFR 314) | Final; FTC breach notice (≥500 consumers, **30 days**) effective **2024-05-13** | Non-bank financial institutions (auto dealers with financing, tax preparers, mortgage brokers…) | High |
| 3 | SOC 2 (AICPA 2017 TSC, 2022 points of focus) | Current attestation standard, **not a regulation** | Contract-driven | High |
| 4 | NIST CSF 2.0 | Final, voluntary (Feb 2024) | Anyone | High |
| 5 | State breach and privacy laws | Breach laws in all 50 states plus DC and territories; about 20 comprehensive privacy laws in effect, 23–24 enacted (IAPP, secondary) | Breach: everyone; privacy: thresholds | High / Medium |
| 6 | HIPAA Security Rule update | **Proposed** (90 FR 898, 2025-01-06); now a "long-term action", target 07/2027; the existing rule remains in force | Covered entities and business associates | Medium–High |
| 7 | ISO/IEC 27001:2022 | Current; 2013 transition ended 2025-10-31 | Voluntary certification | High |
| 8 | AI governance | See §5. No stable target | — | — |
| 9 | SEC cyber disclosure (8-K Item 1.05) | Final, unchanged; reform pressure | Public companies only | Medium–High |

## 7. Regulatory research matrix: MVP scope

| Framework | Status | Effective | Applicability | Obligation | Evidence | Product feature | Legal review |
|---|---|---|---|---|---|---|---|
| CMMC L1 (Self) | Final, in force | 2025-11-10 (Phase 1) | Contracts with 7021 at L1 and FCI | Annual self-assessment and affirmation in SPRS; 15 requirements | Policies, access lists, screenshots, training records, physical access logs | Catalog, evidence locators, affirmation reminder, export | Who may sign the affirmation; FCA exposure |
| CMMC L2 (Self) | Final, in force | 2025-11-10 | Contracts with 7021 at L2 (Self) and CUI | 110 reqs; triennial self-assessment; annual affirmation; POA&M rules | SSP, POA&M, objective-level evidence | Catalog (Rev 2), gaps, POA&M candidate flag, export | Non-POA&M-able items; score method; suspension effects |
| CMMC L2 (C3PAO) | **Suspended** | — | — | — | — | "Prep for later" mode only | When or whether it returns |
| DFARS 252.204-7012 | In force | per contract | Contracts with CDI/CUI | 800-171 Rev 2; 72 h DIBNet; 90-day preservation; FedRAMP for CUI cloud | Incident plan, ECA certificate, logs | Incident checklist and reminders (no submission) | Current clause version |
| 7019 / 7020 / 240-7997 | Changing (RFO) | per contract | Depends on contract text | SPRS Basic score (older clause) | SPRS record | Clause picker in onboarding | Which version a contract carries |
| CIRCIA | Proposed | Unknown | Likely 7012 contractors | 72 h / 24 h to CISA | Incident and payment records | Feature-flagged module | Final scope; DoD agreement |

## 8. Questions for qualified review (counsel or a Registered Practitioner)

1. For each customer contract, which clause versions apply (codified 7019/7020/52.204-21 vs RFO 252.240-7997/52.240-93), and does a Basic SPRS score remain required?
2. The exact text of Deviation 2026-O0025 Rev 3 (the 2028-11-09 date; whether existing C3PAO requirements are removed by modification).
3. Has the CMMC Reform Task Force report or any decision been published after mid-October 2026?
4. The status of RIN 0790-AM01 (Rev 3 transition) and dual baselines with the proposed FAR CUI rule (Rev 3).
5. False Claims Act exposure around annual L2 (Self) affirmations and SPRS scores during the suspension. **What wording must our product avoid?**
6. Does storing **only evidence metadata and locators** (no CUI) keep ControlProof outside DFARS 7012's cloud-provider requirement? Are SSP excerpts or gap lists likely to be CUI?
7. Can full NIST requirement text be reproduced in the product? (Expected yes, U.S. government work, but confirm.)
8. The list of requirements excluded from POA&Ms (§170.21(a)(2)), and confirmation of the 88/110 conditional threshold.

## 9. Pages that could not be opened (to verify by hand)

- dodcio.defense.gov/CMMC news feed, cyberab.org Marketplace, the full text of 32 CFR 170.21–170.23, the 2026-O0025 Rev 3 PDF, the 2026-08-26 FAQ PDF, reginfo.gov entries, ecfr.gov, federalregister.gov.
- These all failed because of this environment's proxy, not because the pages are offline.
