# AISafeProtocol.com: Existing System Audit

Audited **2026-10-22** by Claude Code. Read-only: nothing on the live site, in Render or in Supabase was changed.

**Sources:**
- The `bikesplusjb-crypto/ai-safe-protocol` repo (`main` @ `f976a77`, 9 commits, 2026-08-03 → 2026-08-07).
- The Render service list.
- The Supabase projects visible to this session.

## 1. Architecture today

```
Browser
  │  https://aisafeprotocol.com  (custom domain; see open question Q1)
  ▼
Render static site "ai-safe-protocol" (srv-d9oe07oae00c73b8j8qg)
  · repo main branch, auto-deploy ON for every commit; no build command; publishes "."
  · serves one file: index.html (45 KB: HTML + CSS + JS inline)
  │
  ├─► cdn.jsdelivr.net  @supabase/supabase-js@2  (unpinned, no SRI)
  ├─► fonts.googleapis.com / gstatic (Manrope, IBM Plex Mono)
  ├─► Supabase project fhyezebgywshiolfbvxq (anon key in page)
  │     · INSERT into table "subscribers" (email, interest, source)
  │     · SELECT from table "advisories" (headline, category, published_at, url; is_live, in_feed, sort_order)
  └─► Gumroad (aisafeprotocol.gumroad.com): Control Pack $499, Annual Renewal $149, Poster set $29
```

| Area | Finding |
|---|---|
| Frontend | One hand-written static page. No framework, no build step, no package.json, no tests |
| Backend | None of our own. Supabase is used directly from the browser with the public anon key |
| Hosting / deploy | Render static site. **Every push to `main` goes live immediately**. No staging, no preview deploys |
| Database | Supabase project `fhyezebgywshiolfbvxq`. **Not visible to the Supabase account connected to this session** (that account only shows "card gauge"), so tables, RLS policies and functions could not be inspected |
| Authentication | None (no accounts) |
| Payments | Gumroad checkout links (Gumroad hosts payment and delivery). No Stripe |
| Environment variables | None (static site). The Supabase URL and anon key are hard-coded in the HTML, which is expected for an anon key |
| Pages | One page with sections: hero, assessment (business 18 controls / household 10), Control Record, Control Pack / Incident pack / Renewal pricing, poster set, threat intel feed, footer. No Terms, Privacy, Contact or About pages |
| Forms / APIs | Email capture to Supabase `subscribers`. Advisory feed from `advisories` |
| Secrets | **None found.** History scanned for JWTs: only one token, role `anon`. No `service_role`, Stripe or other keys |

## 2. What can be reused

| Asset | Reuse in the SaaS |
|---|---|
| **18-control business bank + 10-control household bank** (domains VER, DAT, AGT, OUT, PPL, with critical/quick flags, "why" and "fix") | Seeds Module 1 (DAT/OUT), Module 2 (AGT) and Module 3 (PPL/DAT). The VER controls (payment-fraud callbacks) become an "AI-enabled fraud" category. The "why" and "fix" text becomes the recommended-safeguard library |
| Quiz flow (quick 8 vs full 18, "Not sure" → **UNVERIFIED**) | Already separates "unknown" from "met", which matches the principle that **missing evidence must not lower risk**. Keep it |
| Control Record layout (ref no., date, scope, per-domain bars, status table) | Template for the in-app report and the PDF |
| Design system (CSS tokens, Manrope / IBM Plex Mono, seal mark, stamp) | Carry into the app for brand continuity |
| `subscribers` list | Launch announcement, **only if consent and a privacy notice support it** (see S5) |
| `advisories` table and threat feed | Becomes "Threat updates" content in the app and on the marketing site |
| Gumroad products ($499 / $149 / $29 / $49) | Keep selling during the build. Later, decide whether the Control Pack becomes a subscription add-on |

## 3. Security and trust findings

Severity: **High** = fix before any growth push. **Med** = fix in the next site update. **Low** = housekeeping.

| # | Severity | Finding | Fix |
|---|---|---|---|
| S1 | **High (if `advisories` is writable by anyone else); otherwise Med** | `paintFeed()` puts the database fields `headline`, `category` and `url` into `innerHTML` **without escaping**, and `href` accepts any URL (including `javascript:`). Anyone who can write a row in `advisories` can run script on aisafeprotocol.com | Escape all fields; allow only `https:` URLs; add `rel="noopener"`. **Patch prepared on this branch, not deployed** |
| S2 | **Unknown, potentially High** | RLS on `subscribers` and `advisories` could not be checked. If `subscribers` allows anon `SELECT`, **the email list is public** to anyone with the key in the page | Founder runs the check in §5 in the Supabase dashboard. Expected policy: `subscribers` anon = INSERT only; `advisories` anon = SELECT only where `is_live` |
| S3 | Med | `@supabase/supabase-js@2` is loaded from jsDelivr **unpinned and without Subresource Integrity**. A compromised or bad release would run on the site | Pin an exact version and add an `integrity` hash, or drop the library and use two small `fetch` calls to the Supabase REST API |
| S4 | Med | No security headers (Content-Security-Policy, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy) | Add a CSP `<meta>` now; add response headers through Render's Headers settings |
| S5 | Med (legal) | The site collects emails ("+ weekly threat updates") with **no privacy policy, no terms and no unsubscribe information**. The success message says "Sent. Check your inbox." but the page only inserts a row. **It's unknown whether any email is actually sent** (no edge function or trigger was visible) | Add a privacy notice and a consent line; confirm whether an email is sent, and change the message if not. Counsel to review before marketing emails |
| S6 | Med (claims) | The wording conflicts with the new product principles ("never claim certification"). Examples: the "STANDARD MET" stamp, "certificate — dated for the wall", "the small business standard", "defensible if anyone ever asks", "dated record you can show your bank, your insurer". The footer disclaimer helps, but the headline claims are stronger than the disclaimer | Reword: "Self-assessment: all answered controls in place", "Self-assessment record" instead of certificate, a disclaimer next to the stamp. **Founder decision (D4)** |
| S7 | Low | The "Published as techniques appear in the field…" claim isn't verifiable. When the database fails, the **fallback items show fixed August dates as if current** | Soften the claim; label the fallback "Recent examples" without dates |
| S8 | Low | The footer says "Contact" but has no link or address. It says "Some product links are affiliate links, labeled as such" but none are labeled | Add a contact address (founder supplies it); remove the affiliate sentence unless there are affiliate links |
| S9 | Low | `refNo()` uses `Math.random()` (fine for a display reference; not an ID) | No change needed |
| S10 | Info | Auto-deploy from `main` with no staging means any commit to `main` is live instantly | Keep all work on branches; move `main` only with the founder's explicit approval |

## 4. Migration and deployment risks for the SaaS

1. **One file, no build:** the SaaS can't be grown inside `index.html`. It needs a real application (see `PLAN.md`).
2. **Supabase access:** the existing project is in an account this session can't see. The SaaS should use a **new, separate project** anyway (customer data must not share a project with the public email form), but the founder needs to grant access or create it.
3. **Domain routing:** moving the marketing site and adding an app requires DNS changes (for example `app.aisafeprotocol.com`). Done wrong, the live site goes down. This needs explicit, step-by-step instructions and the founder's approval.
4. **Gumroad customers:** anyone who bought the $499 Control Pack or $149 Renewal may expect continuity. Decide how they're treated in the new product (D5).
5. **Existing promises:** "weekly threat updates" has been promised to subscribers. Keep sending them or stop collecting that consent.

## 5. Founder check: Supabase access rules (2 minutes, read-only)

Supabase dashboard → project `fhyezebgywshiolfbvxq` → **SQL Editor** → run:

```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public';
select tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' order by tablename;
```

**Safe result:**
- `rowsecurity = true` for `subscribers` and `advisories`.
- `subscribers` has only an **INSERT** policy for `anon`.
- `advisories` has only a **SELECT** policy for `anon`.

Paste the output back here (it contains no emails or secrets) and Claude Code will check it.

Alternatively, connect that Supabase account to this session and Claude Code can run the Supabase security advisor itself.

## 6. Open questions

- **Q1.** Is aisafeprotocol.com pointed at this Render service? (The Render service shows only the `onrender.com` URL in the API response. Custom domains weren't listed.)
- **Q2.** Is any email actually sent to people who sign up? Through which service?
- **Q3.** How many Gumroad sales and subscribers exist? This is a demand signal for validation.
