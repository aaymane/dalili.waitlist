import { createClient } from '@supabase/supabase-js';

// Server-only — NEVER import this from client components
// Uses SUPABASE_SECRET_KEY (sb_secret_*) which bypasses RLS
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
