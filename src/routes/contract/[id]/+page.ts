import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
  const { supabase } = await parent();
  const resp = await supabase.from('contract').select().eq('id', params.id);
  const contract = resp.data?.at(0);
  const { data: messages } = await supabase.from('message').select().eq('contract_id', contract?.id).order('created_at');

  return {
    contract,
    messages,
  }
}
