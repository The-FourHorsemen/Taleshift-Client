import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Owner: person 5.
 * Requires DATABASE_URL in .env.local. Validate at startup, per
 * the working agreement's security guidelines, not deep inside
 * a request handler.
 */
let queryClient: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set. Check .env.local.");
  }
  if (!queryClient) {
    queryClient = postgres(databaseUrl);
  }
  return drizzle(queryClient, { schema });
}
