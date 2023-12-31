import { embedTextArray } from "./openai";
import { PrismaClient } from "@acme/db";

export async function addVectors({
  chatbotId,
  db,
  docs,
  vectors,
  linkId,
}: {
  vectors: number[][];
  docs: string[];
  chatbotId: string;
  db: PrismaClient;
  linkId?: string;
}) {
  const rows = vectors.map((embedding, idx) => ({
    embedding,
    content: docs[idx],
    chatbotId,
    ...(linkId ? { linkId } : {}),
  }));

  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    try {
      await Promise.allSettled(
        chunk.map(async ({ embedding, ...data }) => {
          const doc = await db.document.create({
            data,
            select: { id: true },
          });
          await db.$executeRaw`
            UPDATE "Document"
            SET embedding = ${embedding}::vector 
            WHERE id = ${doc.id}
          `;
        }),
      );
    } catch (error: any) {
      throw new Error(`Error inserting: ${error?.message}`);
    }
  }
}

export async function addDocuments({
  chatbotId,
  db,
  docs,
  linkId,
}: {
  docs: string[];
  chatbotId: string;
  db: PrismaClient;
  linkId?: string;
}) {
  const vectors = await embedTextArray(docs);
  return addVectors({ vectors, docs, chatbotId, linkId, db });
}

export async function getDocuments(
  chatbotId: string,
  embedding: number[],
  db: PrismaClient,
  limit = 5,
  threshold = 0.8,
) {
  const documents = await db.$queryRaw`
    SELECT 
      "Document"."id",
      "Document"."content",
      "Link"."url" as "source",
      1 - ("Document"."embedding" <=> ${embedding}::vector) as "similarity"
    FROM "Document"
    LEFT JOIN "Link" ON "Link"."id" = "Document"."linkId"
    WHERE 
      "Document"."chatbotId" = ${chatbotId} 
      AND 
      1 - ("Document"."embedding" <=> ${embedding}::vector) > ${threshold}
    ORDER BY "similarity" DESC
    LIMIT ${limit};
  `;
  return documents as {
    id: string;
    content: string;
    source?: string;
    similarity: number;
  }[];
}
