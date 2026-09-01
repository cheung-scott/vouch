import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "@/lib/db/schema";

export type Database = NodePgDatabase<typeof schema>;

declare global {
  var __vouchPgPool: Pool | undefined;
}

/**
 * Postgres handle for the running app.
 *
 * Fails closed: an unset DATABASE_URL throws rather than silently degrading.
 * The KV store's opposite behaviour (quietly falling back to an in-memory
 * store in production, where a cold start drops every escrow hold) is
 * finding NEW-9 — do not reproduce it here.
 *
 * DATABASE_URL must be the *pooled* connection string. Serverless opens a
 * connection per invocation, which exhausts Postgres max_connections without
 * a pooler in front. Migrations use DATABASE_URL_UNPOOLED instead.
 */
export function getDb(): Database {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — refusing to start the Postgres deal store",
    );
  }
  const pool =
    globalThis.__vouchPgPool ?? new Pool({ connectionString, max: 5 });
  if (process.env.NODE_ENV !== "production") globalThis.__vouchPgPool = pool;
  return drizzle(pool, { schema });
}
