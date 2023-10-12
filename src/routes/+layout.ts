import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createClient, type Session } from "@supabase/supabase-js";
import type { Database } from '$lib/database.types'
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data, depends }) => {
  depends('supabase:auth');

  const supabase = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      }
    }
  );
  let { session: _session } = data;
  const resp = await supabase.auth.setSession({
    access_token: _session.access_token,
    refresh_token: _session.refresh_token,
  });
  if (resp.error) {
    console.log("Failed to set session in LayoutLoad", resp);
  }
  const session = resp.data?.session;
  if (!session) {
    throw Error("Bad session in LayoutLoad");
  }
  return { supabase, session: session as Session }
}
