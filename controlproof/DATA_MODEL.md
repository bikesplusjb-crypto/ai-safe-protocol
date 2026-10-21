# ControlProof AI: Data Model and Authorization (Phase 0 draft)

Status: **proposed schema, not yet migrated anywhere**. PostgreSQL. Last updated 2026-10-21.

Conventions:
- **IDs:** every id is a `uuid` (v7), immutable. Every table has `created_at timestamptz not null default now()`.
- **Tenant ownership:** **(T)** marks tenant-owned tables. They carry `org_id uuid not null references organizations(id)`, every index starts with `org_id`, and an RLS policy restricts rows to `org_id = current_setting('app.org_id')::uuid`.
- **Global tables (G):** framework catalog and regulatory sources. They are read-only to customers and written only by an internal "catalog editor" role through reviewed migrations or the review workflow.
- **No hard deletes** of compliance history. Records use `archived_at`. Whole-organization deletion is a separate, logged, delayed job (30-day grace), then purge (files first, then rows).

## 1. Identity and tenancy

| Table | Key columns | Notes |
|---|---|---|
| `users` (G) | id, idp_subject (unique), email (unique, citext), display_name, mfa_enrolled bool, disabled_at | Linked to the identity provider. No passwords stored here. |
| `organizations` | id, name, slug (unique), data_mode (`locator_only` \| `uploads_allowed`), employees_band, locations_count, gov_contractor bool, cui_status (`yes`\|`no`\|`unknown`), archived_at | `data_mode` defaults to `locator_only` |
| `organization_memberships` (T) | org_id, user_id, role (`owner`\|`admin`\|`reviewer`\|`contributor`\|`viewer`), invited_by, accepted_at, removed_at | unique (org_id, user_id) where removed_at is null; at least one owner (enforced in code and by a constraint trigger) |
| `role_permissions` (G) | role, permission | Seeded constant. Permissions: `org.manage`, `member.manage`, `applicability.decide`, `evidence.create`, `evidence.verify`, `gap.manage`, `gap.close`, `export.create`, `billing.manage` |

## 2. Catalog (versioned, global)

| Table | Key columns | Notes |
|---|---|---|
| `frameworks` (G) | id, code (`NIST-800-171`, `CMMC`, `FAR-52.204-21`), name | |
| `framework_versions` (G) | id, framework_id, version (`r2`, `r3`, `L1-2024`), published_on, source_url, status (`draft`\|`active`\|`superseded`), reviewed_by, reviewed_at | unique (framework_id, version). Superseded versions are never deleted. |
| `requirements` (G) | id, framework_id, stable_key (e.g., `3.1.1`) | Identity across versions |
| `requirement_versions` (G) | id, requirement_id, framework_version_id, ref_id, family, official_text, text_license (`public_domain`\|`summary_only`), source_url, guidance_md, guidance_author (`controlproof`), assessment_objectives jsonb, related jsonb, supersedes_id | unique (framework_version_id, ref_id). **Official text and our guidance are separate columns.** Rows are **immutable**: a change means a new row. |

NIST publications are generally U.S. government works. Confirm reuse terms per publication in `RESEARCH.md` before loading the full text.

## 3. Assessment

| Table | Key columns | Notes |
|---|---|---|
| `organization_applicability` (T) | org_id, framework_version_id, decision (`awaiting_review`\|`confirmed`\|`not_applicable`), rationale (required unless awaiting), basis jsonb (which answers led to the proposal), decided_by, decided_at | One current row per (org, framework); history lives in `audit_events` |
| `scopes` (T) | org_id, name, description, in_scope_assets text, out_of_scope text | Plain-language boundary for the MVP |
| `assessments` (T) | org_id, framework_version_id, scope_id, name, started_at, status (`open`\|`closed`), closed_at | **Pins the framework version**, so later catalog changes don't touch it |
| `control_assessments` (T) | org_id, assessment_id, requirement_version_id, status (see the list below), status_set_by, status_set_at, notes | unique (assessment_id, requirement_version_id). Status values: `not_assessed`, `needs_review`, `evidence_missing`, `evidence_submitted`, `verification_pending`, `gap_identified`, `remediation_in_progress`, `evidence_verified`, `review_expired` |

## 4. Evidence

| Table | Key columns | Notes |
|---|---|---|
| `evidence_items` (T) | org_id, title, description, kind (`locator`\|`file`), locator_text, storage_key (nullable, `org/<org_id>/<uuid>`), sha256, size_bytes, mime_type, original_filename, owner_user_id, collected_on, review_by, no_cui_attested_by, no_cui_attested_at, status (`submitted`\|`verification_pending`\|`verified`\|`rejected`\|`expired`), verified_by, verified_at, rejection_reason | A check constraint requires `storage_key` and the attestation when kind = `file`. A trigger blocks `verified_by = uploaded_by` unless an owner override is logged. |
| `evidence_links` (T) | org_id, evidence_id, control_assessment_id, linked_by | unique (evidence_id, control_assessment_id); both sides must have the same org_id (composite foreign key on (org_id, id)) |

**Cross-tenant safety:** child tables use **composite foreign keys** on `(org_id, id)`. That makes it impossible at the database level to link organization A's evidence to organization B's control.

## 5. Gaps and remediation

| Table | Key columns | Notes |
|---|---|---|
| `remediation_tasks` (T) | org_id, control_assessment_id, title, gap_description, source (`self`\|`assessor`\|`ai_suggested_accepted`), owner_user_id, due_on, priority, status (`open`\|`in_progress`\|`ready_for_review`\|`closed`\|`wont_fix`), poam_candidate bool, closed_by, closed_at | Closing requires `gap.close` permission **and** at least one verified evidence link (enforced server-side) |
| `remediation_events` (T) | org_id, task_id, actor_user_id, kind (`comment`\|`status_change`\|`reassign`\|`due_change`\|`evidence_linked`), body, from_value, to_value | Append-only |

## 6. Regulatory intelligence

| Table | Key columns | Notes |
|---|---|---|
| `regulatory_sources` (G) | id, name, url, kind (`federal_register_api`\|`ecfr_api`\|`html`), official bool (must be true to trigger reviews), check_interval | |
| `source_snapshots` (G) | id, source_id, fetched_at, http_status, content_sha256, normalized_text (compressed), raw_storage_key | Keep all snapshots |
| `regulatory_change_reviews` (G) | id, source_id, from_snapshot_id, to_snapshot_id, status (`proposed`\|`in_review`\|`approved`\|`rejected`), impact_md, affected_requirement_ids uuid[], reviewer_id, decided_at | Approval may create new `requirement_versions`. It never edits existing ones. |
| `notifications` (T) | org_id, user_id, kind, ref_table, ref_id, read_at, emailed_at | |

## 7. Audit and billing

| Table | Key columns | Notes |
|---|---|---|
| `audit_events` (T, plus a null org for system events) | id, org_id, actor_user_id, actor_kind (`user`\|`system`\|`support_breakglass`), action (e.g., `evidence.verify`), target_table, target_id, before jsonb, after jsonb (**allow-listed fields only, no file contents or secrets**), ip_hash, user_agent_hash, prev_hash, this_hash, at | **Append-only:** the app's database role has INSERT and SELECT only. `this_hash = sha256(prev_hash ‖ canonical_json(row))` per organization chain. A nightly job verifies the chain. |
| `exports` (T) | org_id, assessment_id, requested_by, format, storage_key, sha256, generated_at, expires_at | The export file records the catalog version and generation time |
| `subscriptions` (T, Phase 5) | org_id, stripe_customer_id, plan, status, current_period_end | No card data stored |
| `ai_suggestions` (T, Phase 3) | org_id, kind, target_table, target_id, input_refs jsonb (ids, not text), model, output_md, citations jsonb, status (`proposed`\|`accepted`\|`rejected`), decided_by | Accepting a suggestion runs the normal permission-checked action. The suggestion itself never writes. |

## 8. Authorization design

1. **Single guard:** `requireOrgRole(ctx, orgId, permission)` resolves the caller's membership (not removed, organization not archived) and checks `role_permissions`. Every server action and route handler calls it before any data access. Lint rule and tests: any handler that imports the database without calling the guard fails CI.
2. **Database backstop:** each request runs in a transaction that executes `SET LOCAL app.org_id` and `app.user_id`. RLS policies on every **(T)** table compare `org_id`. The app connects as a non-owner role, so RLS cannot be bypassed. Migrations run as a separate owner role.
3. **IDs from the client are never trusted alone:** every lookup is `WHERE org_id = $ctx.org AND id = $param`.
4. **Files:** presigned URLs are issued only after (2) and (3). Downloads are 5 minutes, uploads 10 minutes. The content-type and length set at signing are enforced. Buckets block public access.
5. **Tenant-isolation test suite (Phase 1 exit gate):** seed org A and org B, then as an A user try every read, write, file, export and notification endpoint against B's ids. Every attempt must return 404 (not 403, to avoid confirming the record exists) and leave no side effects. Run the same probes directly against Postgres with `app.org_id` set to A and expect zero B rows.

## 9. Indexes (initial)

- `(org_id, status)` on `control_assessments`, `evidence_items`, `remediation_tasks`
- `(org_id, review_by)` on `evidence_items` (expiry job)
- `(org_id, due_on)` on `remediation_tasks`
- `(org_id, at desc)` on `audit_events`
- `(framework_version_id, ref_id)` unique on `requirement_versions`
