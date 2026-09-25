import { createBrowserClient } from "@supabase/ssr";

/**
 * Owner: unassigned.
 * Browser-side Supabase client - use this from "use client" components
 * only (e.g. a client-side auth-state listener). Server Components,
 * Server Actions, and Route Handlers should use lib/supabase/server.ts
 * instead so cookies are handled correctly.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in apps/web/.env.local.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. Check .env.local.");
  }
  return createBrowserClient(url, anonKey);
}
