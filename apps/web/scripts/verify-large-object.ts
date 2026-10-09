import "dotenv/config"

import { createHash, randomBytes } from "node:crypto"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

import { pool } from "../lib/prisma"
import {
  openLargeObjectStream,
  unlinkLargeObject,
  uploadLargeObject,
} from "../lib/large-object"

const SIZE = 8 * 1024 * 1024 + 1234 // > 4 default 2048-byte pages, unaligned

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

async function countLargeObjects(): Promise<number> {
  const result = await pool.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM pg_largeobject_metadata"
  )
  return Number(result.rows[0]?.count ?? 0)
}

async function readAll(oid: number): Promise<{ size: number; buffer: Buffer }> {
  const { size, stream } = await openLargeObjectStream(oid)
  const chunks: Buffer[] = []
  await pipeline(stream, async function* (source) {
    for await (const chunk of source) {
      chunks.push(Buffer.from(chunk))
    }
  })
  return { size, buffer: Buffer.concat(chunks) }
}

async function main() {
  const input = randomBytes(SIZE)
  const inputHash = sha256(input)

  const baseline = await countLargeObjects()
  console.log(`baseline pg_largeobject_metadata count: ${baseline}`)

  console.log(`uploading ${SIZE} random bytes (sha256 ${inputHash})…`)
  const uploaded = await uploadLargeObject(Readable.from(input))
  console.log(
    `uploaded oid=${uploaded.oid} size=${uploaded.size} sha256=${uploaded.sha256}`
  )

  const afterUpload = await countLargeObjects()
  if (afterUpload !== baseline + 1) {
    throw new Error(
      `expected 1 new large object after upload, got ${afterUpload - baseline}`
    )
  }

  console.log("reading back…")
  const { size, buffer } = await readAll(uploaded.oid)
  const outputHash = sha256(buffer)

  const checks: Array<[string, boolean]> = [
    ["returned size matches input", uploaded.size === input.length],
    ["read size matches input", size === input.length],
    ["read buffer length matches input", buffer.length === input.length],
    ["upload sha256 matches input", uploaded.sha256 === inputHash],
    ["read sha256 matches input", outputHash === inputHash],
  ]

  for (const [label, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`)
  }
  if (checks.some(([, ok]) => !ok)) {
    throw new Error("integrity assertions failed")
  }

  console.log("unlinking…")
  await unlinkLargeObject(uploaded.oid)

  const afterUnlink = await countLargeObjects()
  if (afterUnlink !== baseline) {
    throw new Error(
      `orphaned large object after delete: count is ${afterUnlink}, expected ${baseline}`
    )
  }
  console.log(
    `PASS  no orphaned large objects (count back to ${afterUnlink}/${baseline})`
  )

  console.log("\nAll large-object verification checks passed.")
}

main()
  .catch((error) => {
    console.error("\nVerification failed:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
