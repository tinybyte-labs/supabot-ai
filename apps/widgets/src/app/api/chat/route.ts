import { z } from "zod";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@acme/db";
import { buildMessages, canSendMessage, getContextFromDocs } from "./utils";
import { getDocuments } from "@acme/core/utils/vector-store";
import { embedText, moderateText, openai } from "@acme/core/utils/openai";

export const maxDuration = 10; // TODO: Update this to 300 after upgrading vercel plan

const bodySchema = z.object({
  conversationId: z.string(),
  userId: z.string().optional(),
  prompt: z.string().max(500),
});

export async function POST(req: Request) {
  const { prompt, conversationId, userId } = await bodySchema.parseAsync(
    await req.json(),
  );

  const { chatbot } = await canSendMessage(conversationId);
  const message = await moderateText(prompt.trim());
  const embedding = await embedText(message);
  const docs = await getDocuments(chatbot.id, embedding, db);
  const { context, sources } = getContextFromDocs(docs);
  const messages = await buildMessages({
    conversationId,
    chatbot,
    context,
    message,
  });

  await db.message.create({
    data: {
      body: message,
      role: "USER",
      conversationId,
      userId,
    },
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
    temperature: 0,
    user: userId,
    presence_penalty: 1,
    frequency_penalty: 1,
    max_tokens: 512,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          conversationId,
          userId,
          body: completion,
          role: "BOT",
          metadata: {
            sources,
          },
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
