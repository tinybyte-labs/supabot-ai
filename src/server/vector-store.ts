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
            UPDATE documents 
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
      documents.id,
      documents.content,
      links.url as source,
      1 - (documents.embedding <=> ${embedding}::vector) as similarity
    FROM documents
    LEFT JOIN links ON links.id = documents.link_id
    WHERE 
      documents.chatbot_id = ${chatbotId} 
      AND 
      1 - (documents.embedding <=> ${embedding}::vector) > ${threshold}
    ORDER BY similarity DESC
    LIMIT ${limit};
  `;
  return documents as {
    id: string;
    content: string;
    source?: string;
    similarity: number;
  }[];
}
