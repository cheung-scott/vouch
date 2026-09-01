import type { Config } from "drizzle-kit";

// Migrations run over the DIRECT connection, never the pooled one — PgBouncer
// in transaction mode cannot carry the session state DDL needs.
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
