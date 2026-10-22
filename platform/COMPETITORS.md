# AISafeProtocol: Competitor and Market Scan

Checked **2026-10-22**. Every fact comes from **web-search summaries of vendor and official pages**, because direct page fetches were blocked in this environment.
- **Vendor** = a price shown on the vendor's own site (via search).
- **3P** = a third-party estimate.
- **Re-check every price on the live page before quoting it.**

## 1. Regulatory backdrop (affects urgency)

| Item | Status | Confidence |
|---|---|---|
| EU AI Act: GPAI obligations | Apply since 2025-08-02 | High |
| **EU Digital Omnibus on AI** | Adopted as Reg. (EU) 2026/1744, in force 2026-07-27. **High-risk Annex III moved to 2027-12-02; Annex I (AI in products) to 2028-08-02.** Art. 50 transparency still 2026-08-02. SME relief extended to "small mid-caps" | High / Medium-high |
| EU Machinery Regulation 2023/1230 | Applies **2027-01-20**. ML-based safety functions need third-party conformity assessment | High |
| ISO/IEC 42001 | Growing from a small base (~350 certified orgs, unverified figure). Vanta and Drata sell 42001 modules | Direction: High |
| NIST AI RMF | Still 1.0, under revision. NIST CAISI AI Agent Standards Initiative launched 2026-02-17 | Medium |
| Robot standards | ISO 10218-1/-2:2025 and ANSI/A3 R15.06-2025 published. UL 3300 still an Outline of Investigation. ISO 25785-1 (humanoids) still a draft | Medium-high |
| Gartner | First Magic Quadrant for AI Governance Platforms (mid-2026): IBM, ServiceNow and Truyo leaders; Holistic AI challenger; OneTrust, ModelOp, Airia, Credo AI and Monitaur visionaries | Medium |

## 2. Who's in each module (condensed)

**Module 1: AI software risk.** This is the most crowded module, and it's commoditising.
- **Enterprise, sales-led, no self-serve:** Credo AI, Holistic AI, Trustible, Monitaur, ModelOp, OneTrust, IBM watsonx.governance, Saidot (3P from about €1,000/mo), Lumenova.
- **Vanta / Drata AI Governance:** integration-based, about $10K+/yr (3P).
- **Self-serve at SMB prices** (mostly questionnaires and document generators):
  - **ComplyLayer:** Free / **$149/mo** (vendor); 12 months of Pro free until 2026-12-31.
  - **Govern365:** **$239 / $799 / $1,999 per month** (vendor).
  - **Alethexis:** about €175/mo (3P).
  - **Kelvori:** £149 (3P).
  - **Riskonyx:** about €129 (low confidence).
  - **Free:** Modulos Starter, VerifyWise tools, and the free EU AI Act checkers.

**Module 2: AI agents.** Enterprise-only, integration-based and consolidating.
- **Independent:** Zenity ($125M Series C, Aug 2026), Noma, Pillar, Lasso, WitnessAI.
- **Acquired:** Lakera (Check Point), Protect AI (Palo Alto), Prompt Security (SentinelOne), Aim (Cato), CalypsoAI (F5).
- **Platform add-ons:** Vanta added agent inventory (Jul 2026); Credo and Drata have previews.
- **No SMB-priced agent risk product found.**

**Module 3: Employee AI use.** Moderate competition, and it's integration-based.
- **Microsoft Purview Suite for Business Premium:** **$10 per user per month** (vendor), M365 shops only.
- **Nudge Security:** **$750/mo up to 150 users** (vendor).
- **Shadow AI Detector:** $500/mo for 50 or fewer employees (vendor).
- **LayerX:** about $425/mo minimum (3P).
- **DNS filters:** $1–3 per user (3P).
- **Enterprise:** Harmonic, Nightfall, Cyberhaven, Island.

**Module 4: Robots and physical AI.** No AI-governance vendor covers it.
- **Generic machinery-safety software:**
  - **Safexpert:** **€99–264/mo** (vendor), for ISO 12100 / CE marking.
  - DOCUFY, AFRY Zert, TÜV SÜD mCom+.
  - SISTEMA (free).
- **Testing and certification services:** TÜV SÜD, UL Solutions.

**Consultants and MSPs:**
- **Thalus:** the closest analogue. Built for AI advisory firms, with a workspace per client and white-label reports. **1 free assessment; $250 per 5; Team $500/mo** (vendor).
- **ScalePad ControlMap:** **$0 / $99 / $299 per client per month** (vendor), ISO 42001.
- **6clicks:** free advisor hub.
- **Cynomi:** vCISO platform with 42001.
- **Apptega:** about $9,950/yr per tenant (competitor claim).
- **Vanta MSP and Secureframe partner programs:** prices are gated.

## 3. What this means for AISafeProtocol

1. **Don't lead with generic AI-software questionnaires.** At $49–149/mo, that's the most crowded spot, and free tools set the floor at $0.
2. **The open gaps at SMB and consultant prices are:**
   - **AI agents and automations:** what each can do, who approves, how to switch it off. No SMB-priced product found. This fits the existing AGT controls.
   - **Combining the four modules** in one register for a consultant's clients.
   - **Robots and physical AI combined with AI risk.** No product found, but liability is high and it needs functional-safety expertise. Keep it last, as planned.
3. **The urgency of the EU AI Act fell** because high-risk obligations were delayed to Dec 2027. Lead with business risks that apply now (agents that can pay, delete, email; AI-enabled fraud; data in chatbots), not regulatory deadlines.
4. **The closest direct competitor is Thalus,** which serves consultants. Differences we could offer: agent-specific assessment, evidence with confidence and freshness, reassessment history, and per-client pricing below $500/mo. Interviews must test whether these matter.

**Recommended positioning to test:** *"Know what your AI agents and automations can do, who approves them, and how to stop them, with a report you can hand to a client, insurer or board."* Lead with **Module 2**, then Module 3, sold to SMBs directly and to consultants per client.
