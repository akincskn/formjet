import { createBrowserClient } from "@supabase/ssr";

// WHY singleton pattern: Next.js hot-reload creates new module instances
// in dev mode; memoizing prevents duplicate GoTrueClient warnings.
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
