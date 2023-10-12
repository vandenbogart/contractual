import { PRIVATE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/database.types';
import { createClient, type Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { randomUUID } from "node:crypto";

export const handle: Handle = async ({ event, resolve }) => {
  const supabaseAdmin = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      }
    }
  );
  const supabase = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      }
    }
  );
  const access_token = event.cookies.get("access-token");
  const refresh_token = event.cookies.get("refresh-token");

  let session: Session | null = null;

  if (!access_token || !refresh_token) {
    const email = `${randomUUID()}@dummy-email.com`;
    const password = `${randomUUID()}`;
    const createResp = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createResp.error) {
      console.log("Failed to create auth user", createResp.error);
    }
    else {
      const result = await supabaseAdmin.from('users').insert({
        balance: 10,
        id: createResp.data.user.id,
      });
      if (result.error) {
        console.log("Failed to initialize user", result);
      }
    }

    const loginResp = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginResp.error) {
      console.log("Failed to sign in new user", loginResp);
    }
    session = loginResp.data?.session;
  }
  else {
    const resp = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (resp.error) {
      console.log("Failed to set session", resp);
    }
    session = resp.data?.session;
  }

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await supabase.auth.getSession()`
   * you just call this `await getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  event.locals.supabase = supabase;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}
