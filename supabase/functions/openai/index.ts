// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import {serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@1.4.2/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const body = await req.json()
  const schema = z.object({
    messages: z.array(z.object({
      role: z.literal("user").or(z.literal("assistant")).or(z.literal("system")),
      content: z.string(),
    })),
  });
  const data = schema.parse(body);
  const res = await fetch(
    `https://api.openai.com/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: data.messages,
        n: 1,
        stream: true,
      }),
    },
  );
  const reader = res.body!.getReader();
  const stream = new ReadableStream({
    start(controller) {
      return pump();

      function pump(): any {
        return reader.read().then(({ done, value}) => {
          if (done) {
            controller.close();
          }

          controller.enqueue(value);
          return pump();
        });
      }

    }

  });

  return new Response(stream, {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
})
// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
