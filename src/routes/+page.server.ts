import { fail, type Actions, redirect } from "@sveltejs/kit";

const systemPrompt = {
  role: "system",
  content: "You are a professional lawyer who specializes in writing legal contracts. \
    Ask the client what kind of contract they would like to create. \
    Respond with the contract and a follow up question."
}

const assistantPrompt = {
  role: "assistant",
  content: "What kind of legal contract would you like to create?",
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase, getSession }}) => {
    const data = await request.formData();
    const prompt = data.get('prompt');
    if (!prompt) {
      return fail(400, { prompt, missing: true })
    }
    const session = await getSession();
    const resp = await supabase.from('contract').insert({
      user_id: session?.user.id,
    }).select();
    if (resp.error) {
      console.log("Failed to create contract", resp);
      fail(500);
    }
    const contract_id = resp.data?.at(0)?.id;
    await supabase.from('message').insert({
      ...systemPrompt,
      contract_id,
    });
    await supabase.from('message').insert({
      ...assistantPrompt,
      contract_id,
    });
    const mResp = await supabase.from('message').insert({
      role: "user",
      content: prompt.toString(),
      contract_id,
    });
    if (mResp.error) {
      console.log("Failed to create message", mResp);
      fail(500);
    }
    throw redirect(303, `/contract/${contract_id}`);
  },
}

