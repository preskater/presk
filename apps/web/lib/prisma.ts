import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

import { PrismaClient } from "./generated/prisma/client"

/**
 * Serverless-friendly Postgres pooling.
 *
 * On Vercel (and other serverless platforms) each function instance created its
 * own `pg.Pool`, and `@prisma/adapter-pg` defaults that pool to `max: 10`.
 * Under concurrency that exhausts the database role's connection limit
 * (`P2037 / TooManyConnections`). We instead build one small, explicitly
 * configured pool per instance and strongly recommend pointing `DATABASE_URL`
 * at a connection pooler (PgBouncer / Neon / Supabase / Accelerate).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function poolMax() {
  const value = Number(process.env.DATABASE_POOL_MAX)
  if (Number.isFinite(value) && value > 0) return value
  return 3
}

function makePool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: poolMax(),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  })
}

function createPrisma() {
  const adapter = new PrismaPg(makePool(), { disposeExternalPool: true })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrisma()

// Cache across warm invocations of the same serverless instance.
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
