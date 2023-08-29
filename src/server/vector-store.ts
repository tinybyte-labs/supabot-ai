import { embedTextArray } from "./openai";
import { prisma } from "./prisma";
import { Document } from "@prisma/client";

export async function addVectors(
  vectors: number[][],
  docs: string[],
  chatbotId: string,
  linkId?: string,
) {
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
          const doc = await prisma.document.create({
            data,
            select: { id: true },
          });
          await prisma.$executeRaw`
          UPDATE "Document" 
          SET embedding = ${embedding}::vector 
          WHERE "id" = ${doc.id}
        `;
        }),
      );
    } catch (error: any) {
      throw new Error(`Error inserting: ${error?.message}`);
    }
  }
}

export async function addDocuments(
  docs: string[],
  chatbotId: string,
  linkId?: string,
) {
  const vectors = await embedTextArray(docs);
  return addVectors(vectors, docs, chatbotId, linkId);
}

export async function getDocuments(
  chatbotId: string,
  embedding: number[],
  threshold = 0.78,
  limit = 5,
) {
  const documents = await prisma.$queryRaw`
    SELECT 
      "Document"."id", 
      "Document"."createdAt",
      "Document"."updatedAt",
      "Document"."content", 
      "Document"."linkId",
      "Document"."chatbotId",
      "Document"."metadata",
      "Link"."url" as "source",
      1 - ("Document"."embedding" <=> ${embedding}::vector) as "similarity" 
    FROM "Document"
    LEFT JOIN "Link" ON "Link"."id" = "Document"."linkId"
    WHERE "Document"."chatbotId" = ${chatbotId} AND 1 - ("Document"."embedding" <=> ${embedding}::vector) > ${threshold}
    ORDER BY "similarity" DESC
    LIMIT ${limit};
  `;
  return documents as Array<Document & { similarity: number; source?: string }>;
}
