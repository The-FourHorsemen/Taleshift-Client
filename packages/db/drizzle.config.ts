import type { Config } from "drizzle-kit";

/**
 * Owner: person 5.
 * DATABASE_URL should point at the Supabase project's Postgres
 * connection string (Project Settings -> Database -> Connection string,
 * "URI" tab - use the pooled "Transaction" connection for the app at
 * runtime, but the direct connection for running migrations).
 */
export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
