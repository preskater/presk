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

- **Bytes → large objects.** `lib/large-object.ts` streams uploads into a large
  object and streams them back out. Nothing is buffered in memory: the request
  body is piped through `Readable.fromWeb(...)` and responses stream via
  `Readable.toWeb(...)`.
- **Metadata → Prisma.** `FileNode`, `FileVersion`, and `MessageAttachment` hold
  `oid BigInt? @unique`, `sizeBytes`, `mimeType`, and `sha256`. The SHA‑256 of the
  stored bytes is recorded at upload time.
- **One shared pool.** `lib/prisma.ts` exports a single `pg.Pool` that is handed
  to `new PrismaPg(pool, { disposeExternalPool: false })`; Prisma and the
  large-object code share it. Each large-object operation runs on one dedicated
  connection inside a single `BEGIN … COMMIT` transaction (never `pool.query()`).

### Operational caveats

- **Connections are held for the duration of a transfer.** Each in-flight
  upload/download occupies one pooled connection (default pool max is 3). Raise
  `DATABASE_POOL_MAX` if large transfers run concurrently with Prisma traffic,
  or use a separate pool for large objects. Point `DATABASE_URL` at a pooler in
  production.
- **Size cap.** `MAX_FILE_BYTES` in `app/api/files/upload/route.ts` is 4 MiB,
  which is safe for Vercel's ~4.5 MB serverless request-body limit. Self-hosted
  deployments (e.g. Docker Compose) can raise it.
- **No Blob migration.** Existing `storageKey` values were dropped in the
  `20261009140000_replace_blob_with_large_object` migration; old Blob bytes are
  not imported.
- **Message attachments** uploaded through the composer are stored immediately
  but only referenced once the message is sent. An attachment that is uploaded
  and then discarded leaves an orphaned large object (no background GC).
- **Deletes** unlink the backing large object(s) synchronously on a best-effort
  basis and log failures without failing the request.

### Verifying

`apps/web/scripts/verify-large-object.ts` uploads ≥8 MiB of random bytes, reads
them back, asserts equal size and SHA‑256, then deletes and asserts
`pg_largeobject_metadata` returns to its baseline:

```bash
npm run verify:large-object --workspace=web
```

