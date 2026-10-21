# ControlProof AI: Deployment (Phase 0)

**Nothing is deployed.** Phase 0 produced documents only:
- no accounts were created;
- no paid services were connected;
- no code is running.

This file is a placeholder. It will be filled in during Phase 1 with tested, exact steps.

## What Phase 1 will document here (checklist)

1. **Accounts the founder creates.** Claude Code never creates accounts or enters payment details. For each one, Phase 1 will give the exact steps and the settings to turn on (MFA, billing alerts):
   - a new GitHub private repo;
   - a Render workspace project (or the existing workspace);
   - an AWS account with a billing alarm;
   - the identity provider;
   - the email provider.
2. **Environment variables.**
   - Every variable name, what it's for, and where to paste it in Render.
   - `.env.example` in the repo with names only.
   - Secrets never go in chat or git.
3. **Database.**
   - Create the managed Postgres.
   - Run migrations with one documented command.
   - Confirm with a check query.
   - Rollback: restore a point-in-time backup, with documented steps and a rehearsed restore.
4. **Storage.**
   - Bucket settings: Block Public Access, SSE-KMS, versioning, lifecycle rules.
   - A CORS policy limited to the app domain.
5. **Deploy.**
   - Staging first, from the `main` branch of the new repo.
   - A smoke-test list.
   - Then production, **only with the founder's explicit go-ahead**.
6. **Rollback.** Render "rollback to previous deploy", plus the database restore steps.
7. **Verification.**
   - Each step lists the exact thing the founder should see.
   - Results go into `TEST_REPORT.md`.
   - Nothing is marked "done" unless it has been verified.
