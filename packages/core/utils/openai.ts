import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function embedText(text: string) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text.replace(/\n/g, " "),
  });
  return embeddingResponse.data[0].embedding;
}

export async function embedTextArray(texts: string[]) {
  const vectors = await Promise.all(texts.map((text) => embedText(text)));
  return vectors;
}

export async function moderateText(input: string) {
  const moderation = await openai.moderations.create({ input });
  if (moderation.results[0].flagged) {
    throw new Response("Flagged content", { status: 400 });
  }
  return input;
}
