import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
  let { supabase, session } = await parent();

  let resp = await supabase.from('users').select();

  return {
    user: resp?.data?.at(0),
  }
}
