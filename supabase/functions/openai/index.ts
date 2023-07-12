// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import {serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@1.4.2/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

serve(async (req) => {
  const body = await req.json()
  const schema = z.object({
    messages: z.array(z.object({
      role: z.literal("user").or(z.literal("assistant")).or(z.literal("system")),
      content: z.string(),
    })),
  });
  const data = schema.parse(body);
  console.log(data);
  const openAI = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);

  const chatCompletion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: data.messages,
  });

  return new Response(JSON.stringify(chatCompletion.choices[0].message));
})
// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
