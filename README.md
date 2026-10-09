# Presk

**AI‑Native Productivity Platform**

Presk is an AI‑first workspace that automates your workflow, centralizes your tasks, and connects your team in one place. It combines calendars, projects, files, and messaging with built‑in AI assistants to help you move faster and stay aligned.

## What you can do with Presk

- **Calendars** – Schedule meetings, set reminders, and manage events across teams.  
- **Projects** – Create projects, assign tasks, track progress, and manage deadlines.  
- **Files** – Create, edit, and co‑author documents in real time with your team and AI.  
- **Messages** – Chat with teammates and AI assistants in shared channels and threads.  
- **Dashboard** – See all your tasks, projects, and team activity in a single, customizable view.

## Why Presk

- **AI‑native**: AI is embedded in every surface—drafting docs, summarizing threads, suggesting next actions, and automating repetitive work.  
- **Unified workspace**: No more switching between tools; everything you need lives in one platform.  
- **Team‑first**: Built for collaboration, with real‑time editing, shared context, and clear ownership.

## File storage

Uploaded files are stored as **PostgreSQL large objects** (`pg_largeobject`) in the
same database as their metadata. There is no external object storage (Vercel
Blob has been removed).

- **Bytes → large objects.** `lib/large-object.ts` streams bytes into a large
  object and streams them back out. Responses use `Readable.toWeb(...)`; nothing
  is buffered in memory.
- **Chunked uploads (Vercel-safe).** Vercel caps a Function request body at
  **4.5 MB**, so a file is uploaded in 3 MiB chunks under an `UploadSession`
  instead of one request:
  - `POST /api/files/uploads` — authz + quota check, creates the large object and
    an `UploadSession` (`name`, `parentId`, `mimeType`, `expectedSize`, `transient`).
  - `PUT /api/files/uploads/[uploadId]` — appends one raw chunk; the
    `x-chunk-offset` header must equal the bytes already received (rejects gaps,
    duplicates, and reordering). Retries are safe.
  - `POST /api/files/uploads/[uploadId]/complete` — re-reads the stored bytes to
    validate size + SHA‑256, then creates the `FileNode`/`FileVersion` (or returns
    the `oid` for a transient message attachment).
  - `DELETE /api/files/uploads/[uploadId]` — aborts and unlinks the large object.
  - `GET /api/files/uploads/sweep` — unlinks sessions older than their lease
    (`CRON_SECRET`-guarded when set; also runs opportunistically on init).
- **Metadata → Prisma.** `FileNode`, `FileVersion`, and `MessageAttachment` hold
  `oid BigInt? @unique`, `sizeBytes`, `mimeType`, and `sha256`. `UploadSession`
  tracks in-progress uploads.
- **One shared pool.** `lib/prisma.ts` exports a single `pg.Pool` handed to
  `new PrismaPg(pool, { disposeExternalPool: false })`; Prisma and the
  large-object code share it. Each large-object operation runs on one dedicated
  connection inside a single `BEGIN … COMMIT` transaction (never `pool.query()`).
- **Downloads** stream the large object with `Content-Length`/`Content-Disposition`;
  `maxDuration` is set on the upload/download routes.

### Operational caveats

- **Connections are held for the duration of a transfer.** Each in-flight
  upload/download occupies one pooled connection (default pool max is 3). Raise
  `DATABASE_POOL_MAX` if transfers run concurrently with Prisma traffic, or use a
  separate pool for large objects. Point `DATABASE_URL` at a pooler in production.
- **No fixed per-file cap.** Uploads are bounded only by the organization's
  remaining storage quota (free 1 GiB / team 100 GiB / enterprise 1 TiB). A large
  download holds a pooled connection for the whole transfer, so very large files
  are best served from a dedicated media host.
- **In-memory retry only.** A failed chunk is retried within the session; uploads
  do not resume across page reloads. Abandoned sessions are unlinked after their
  lease expires.
- **No Blob migration.** Existing `storageKey` values were dropped in the
  `20261009140000_replace_blob_with_large_object` migration; old Blob bytes are
  not imported.
- **Deletes** unlink the backing large object(s) synchronously on a best-effort
  basis and log failures without failing the request.
- **SSL warning.** Set `sslmode=verify-full` (or
  `uselibpqcompat=true&sslmode=require`) in `DATABASE_URL` to silence the
  `pg-connection-string` deprecation warning on cold start.

### Verifying

`apps/web/scripts/verify-large-object.ts` uploads ≥8 MiB of random bytes, reads
them back, and asserts equal size and SHA‑256 for both the single-shot and the
chunked create/append/hash paths; it then deletes/aborts and asserts
`pg_largeobject_metadata` returns to its baseline (no orphans):

```bash
npm run verify:large-object --workspace=web
```


