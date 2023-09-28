import { Configuration, OpenAIApi, type ResponseTypes } from "openai-edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export async function embedText(text: string) {
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text.replace(/\n/g, " "),
  });

  if (!embeddingResponse.ok) {
    throw new Response("Failed to create embeddings", { status: 400 });
  }

  const embeddingData =
    (await embeddingResponse.json()) as ResponseTypes["createEmbedding"];

  const embedding = embeddingData.data[0]!.embedding;
  return embedding;
}

export async function embedTextArray(texts: string[]) {
  const vectors = await Promise.all(texts.map((text) => embedText(text)));
  return vectors;
}

export async function moderateText(input: string) {
  const moderationResponse = await openai.createModeration({ input });

  if (!moderationResponse.ok) {
    throw new Response("Failed to create moderation", { status: 400 });
  }

  const moderation =
    (await moderationResponse.json()) as ResponseTypes["createModeration"];
  if (moderation.results[0]?.flagged) {
    throw new Response("Flagged content", { status: 400 });
  }

  return input;
}
