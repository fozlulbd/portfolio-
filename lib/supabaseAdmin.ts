import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY client using the service role key.
 * Never import this in a "use client" component — it will leak the key.
 * Only use inside API routes / server actions.
 *
 * Add to your .env.local:
 *   SUPABASE_SECRET_KEY=your-service-role-key
 * (Find it in Supabase Dashboard > Project Settings > API > service_role)
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);