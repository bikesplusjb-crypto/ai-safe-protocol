# ControlProof AI: Competitors (Phase 0)

Checked **2026-10-21**.

**Limits on this research:**
- Direct page fetches failed through this environment's proxy. Every fact comes from **web-search summaries of the vendor's own pages**: "search-verified" means the vendor's page said it.
- **[UNVERIFIED]** marks anything from a third party, a competitor, or conflicting sources.
- **Re-check every price on the vendor's page before quoting it.**
- Reddit (r/CMMC, r/msp) returned no results. Complaint evidence comes only from G2, Capterra and GetApp.

## 1. Market context that changes everything

- **CMMC Phase II is suspended.** Reports say the Department of War (formerly DoD) suspended Phase II on **July 13, 2026**. It had been due Nov 10, 2026. Until it restarts, contracting officers can require only **Level 1 (Self)** or **Level 2 (Self)**. A CMMC Reform Task Force began a 60-day review focused on "lowering barriers for small and non-traditional businesses". **No report or restart date was found as of late September.** Status is in `RESEARCH.md`. Sources: war.gov release 4542329; dowcio.war.gov "ImplementingSuspensionCMMC-PhaseII.pdf"; WilmerHale client alert 2026-07-20.
- **DFARS 252.204-7012 and NIST SP 800-171 Rev 2 still apply** to contracts with CUI. Rev 3 (97 requirements) is published, but the DoD class deviation keeps 7012 at Rev 2. See `RESEARCH.md`.
- **What CMMC Level 2 costs a small business**, per DoD's own rule analysis (cited second-hand, **[verify in 89 FR 83092]**): about **$104,670 over 3 years** for a C3PAO-assessed small entity. That figure **excludes** implementing the controls. Market quotes (**[UNVERIFIED]**): SSP and documentation **$10K–$60K**; C3PAO fee **$20K–$75K**.
- **Cloud rule:** a cloud service that *stores, processes or transmits CUI* must be FedRAMP Moderate or 3PAO-assessed "equivalent". SOC 2 does **not** count (DoD CIO memo, Dec 2023, per secondary summaries).

## 2. Competitor matrix

| Vendor | Type | CMMC / 800-171 | Hosting / FedRAMP | Price (source) | Strength | Complaints |
|---|---|---|---|---|---|---|
| **Vanta** | General GRC | L1–L3; claims "up to 50%" of CMMC automated | Gov Cloud: FedRAMP 20x Moderate (Marketplace) | Not published. Vendr median about $20K/yr, range $7.5K–$57K **[third-party]** | Best documented GCC High connectors (Intune, Entra, Defender) | Price for small firms, renewal increases, alert fatigue, slow support (G2/Capterra) |
| **Drata** | General GRC | CMMC, 800-171 listed | FedRAMP 20x Low. **Tells customers not to store federal-impact data; link it instead** | Not published (third-party medians conflict: $24.6K vs $38K) | Continuous monitoring | GCC High connector limited to select accounts |
| **Secureframe** | General GRC + "Federal" | SSP, POA&M, 110 controls, managed enclave; claims own CMMC L2 and RPO status **[UNVERIFIED]** | 20x Low; claims 20x Moderate **[UNVERIFIED]** | Not published. Vendr median about $20K/yr **[third-party]** | Strong federal marketing; MSP partner program (multi-tenant, NFR licence) | No CMMC-specific reviews found |
| **Sprinto** | General GRC | Markets CMMC L1 / 2.0; depth unclear (conflicting sources) | None found | Not published (about $6–25K/yr **[third-party]**) | SMB-friendly | CMMC depth unclear |
| **Thoropass** | GRC + audit | CMMC L1 page; no L2 page found | None found | Not published | Bundles the audit | L1 only |
| **FutureFeed** | CMMC GRC | SSP, POA&M; L1 free; L2 add-on | AWS GovCloud (vendor) | **$99/mo** (≤25 FTE, annual); $399/mo Standard; L2 add-on $1,008/yr **(Capterra shows $499: conflict)** | Cheapest credible tool, unlimited users | Documents only; no reviews on Capterra |
| **Totem Technologies** | CMMC GRC + enclave PC | SSP, POA&M | n/a | **Published:** L1 package $5,000–$7,000/yr; enclave $6,495–$19,995/yr; partner $5,400/yr | Transparent pricing, no lock-in | Own pages conflict on enclave price |
| **PreVeil** | CUI enclave (email/files) + "Pass" | Claims >90% of 800-171 supported | Claims FedRAMP Moderate equivalency **[UNVERIFIED]** | **$450/mo for 3 users** ("Pass" page, search-verified) | Pay only for CUI users | Doesn't do SSP, endpoint or policy work (consultant comment) |
| **Paramify** | Federal GRC (OSCAL) | L2–L3 SSP, POA&M | n/a | $8,000/yr flat (G2/Software Advice listing) | OSCAL export | — |
| **IntelliGRC** | MSP CMMC GRC | CMMC focus | n/a | From $425/mo (listing) | Built for MSPs; $3.5M seed (Mar 2026) | — |
| **ControlMap (ScalePad)** | MSP GRC | CMMC SSP and SPRS tools (top tier) | n/a | **$0 / $99 / $299 per client per month** (scalepad.com) | Per-tenant MSP pricing | — |
| **Kaseya Compliance Manager GRC** | MSP GRC | CMMC; customer responsibility matrices | n/a | Not published | Scanner-based evidence | 3.8/5 Capterra; "expensive for what it is"; support (Capterra) |
| **Apptega** | MSP GRC | CMMC | n/a | Not published (reseller margins) | MSP channel | — |
| **ComplianceForge** | Templates | 800-171 program | n/a | **$3,000–$26,100** bundles (published) | Assessor-friendly documents | Static; no tracking |
| **Exostar / Summit 7 / CyberSheath / Cuick Trac / Kiteworks** | Managed GCC High, enclaves, CUI exchange | Reduce scope; inherited controls | GCC High / Azure Gov / FedRAMP Moderate (Kiteworks since 2017) | Mostly not published (Exostar managed M365 from $50/user/mo) | Infrastructure; prime relationships | — |

Not found or not relevant: Cytrio, Galactic Advisors, "CMMC Center of Awareness" (no CMMC tool found).

## 3. Answers to the nine questions

1. **Who automates 800-171 evidence?**
   - Vanta, Secureframe Federal and (in limited form) Drata, through cloud/identity connectors. RegScale and Kaseya partly, through scans.
   - The CMMC-native tools (FutureFeed, Totem, Paramify, IntelliGRC, ControlMap) are mainly **documentation, SSP and POA&M** tools.
   - No tool found automates policy, physical, personnel or training controls; Vanta itself claims only "up to 50%".
2. **Who is underserved?**
   - **5–50 person shops**, especially machine shops and manufacturers. They're priced out of tools costing about $20K/yr, and left to write the SSP themselves with the cheap tools.
   - Firms only needing **L1 or L2 (Self)**, which is all that can currently be required.
   - Firms on Google Workspace.
   - Subcontractors told by primes to "be CMMC compliant" who may never touch CUI, and need **scoping help first**.
3. **What still needs consultants?**
   - Scoping and CUI data-flow mapping.
   - SSP narrative ($10–60K quoted).
   - Remediation itself.
   - Enclave or GCC High migration.
   - Mock assessments.
4. **Monitoring vs storage:**
   - Monitoring: Vanta, Drata, Secureframe; partly RegScale and Kaseya.
   - Document-centric: FutureFeed, Totem, Paramify, IntelliGRC, ControlMap, Apptega, ComplianceForge.
   - Scope reducers: the enclaves.
5. **Expected integrations:**
   - M365 GCC High: Entra, Intune, Defender.
   - Azure Government, AWS GovCloud.
   - Commercial M365 / Google Workspace (L1).
   - For MSPs: RMM/PSA tools.
   - SPRS score worksheet; OSCAL export.
6. **Switching difficulty:** moderate to high. SSPs, POA&Ms and evidence histories are vendor-specific, contracts have yearly terms, and switching mid-assessment is risky. Template buyers switch easily.
7. **Can a new entrant differentiate?**
   - Affordability: a gap exists between $99/mo document tools and ~$20K/yr automation tools.
   - Simplicity: self-assessment made easy.
   - Evidence quality: evidence per assessment objective (800-171A), not just per requirement.
   - Channel: MSPs and RPOs.
   - **But FutureFeed and Totem already anchor low prices.** A $99 starter tier isn't a differentiator by itself.
8. **Can MSPs or consultants resell?** Yes, and it's common: Secureframe, Vanta, Apptega, Totem, ControlMap, IntelliGRC and Kaseya all have partner models.
9. **Trust barriers:**
   - The CUI cloud rule (FedRAMP Moderate or equivalent).
   - Buyers expecting SOC 2.
   - Some vendors advertising their **own** CMMC L2 certification.
   - Incumbents already hold FedRAMP 20x authorizations.
   - **False Claims Act exposure** for customers who submit wrong scores or affirmations means over-claiming tools are a liability. One competitor markets "guaranteed to pass"; we must not.

## 4. Three defensible opportunities

| # | Opportunity | Why now | Biggest risk |
|---|---|---|---|
| 1 | **"No-CUI-by-design" self-assessment workbench for 5–50 person shops.** Scoping triage ("do I actually need Level 2?"), objective-level evidence checklists, SSP/POA&M drafting, annual affirmation reminders. Evidence stays in the customer's tenant; we keep only locators and hashes. | Only self-assessments can be required during the suspension; the task force aims to lower burdens on small firms | **Policy volatility:** demand may soften while C3PAO assessments are paused. FutureFeed ($99/mo) and Totem anchor low prices |
| 2 | **MSP / RPO multi-client tracker.** Per-client pricing, a customer-responsibility matrix (what the MSP vs the client covers), white-label evidence packages | Small contractors buy through MSPs | Channel incumbents (Kaseya, ControlMap, IntelliGRC, Apptega) and bundling by RMM vendors |
| 3 | **Assessor-grade evidence binder.** Sold per assessment (about $1–3K): evidence for each 800-171A assessment objective, interview prep, gap findings, OSCAL export. Complements existing GRC tools instead of replacing them | Targets the most expensive manual step ($10–60K of consultant prep) | **Trust and liability:** without the founder's own credentials (CCP/CCA, RPO) and SOC 2, buyers and assessors may discount it |

**Recommendation:** combine 1 and 2. Build the workbench, sell it mainly through MSPs, and keep the evidence-binder export as the paid "proof" feature. See `RESEARCH.md` §Summary and the go/no-go criteria in `IMPLEMENTATION_PLAN.md`.

## 5. Where to find interviewees (channels)

- MSPs and RPOs listed in the Cyber AB Marketplace (cyberab.org).
- Regional APEX Accelerators (formerly PTACs), which run free sessions for small government contractors.
- NDIA chapters, and local manufacturing extension partnerships (NIST MEP centers run CMMC programs).
- LinkedIn groups for CMMC and defense manufacturing.
