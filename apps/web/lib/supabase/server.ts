import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Owner: unassigned.
 * Server-side Supabase client for Server Components, Server Actions,
 * and Route Handlers - reads/writes the Supabase auth cookies via
 * next/headers so the session survives across requests.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in apps/web/.env.local.
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. Check .env.local.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component (not a Server Action/Route
          // Handler) - cookies can't be written there. Safe to ignore
          // as long as middleware also refreshes the session.
        }
      },
    },
  });
}
