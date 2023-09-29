import TurndownService from "turndown";
import { prisma } from "@acme/db";
import { addDocuments } from "./vector-store";

const turndownService = new TurndownService();

export const splitDocumentIntoChunks = (
  text: string,
  chunkSize: number,
  chunkOverlap: number,
) => {
  const tokens = Array.from(text);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const token of tokens) {
    if (currentChunk.length + token.length <= chunkSize) {
      currentChunk += token;
    } else {
      chunks.push(currentChunk);
      currentChunk =
        currentChunk.slice(
          currentChunk.length - chunkOverlap,
          currentChunk.length,
        ) + token;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
};

export const getDocumentsFromWeb = async (url: URL) => {
  const res = await fetch(url);
  const htmlText = await res.text();
  const rawText = turndownService.turndown(htmlText);
  const chunks = splitDocumentIntoChunks(rawText, 1000, 100);
  return chunks;
};

export const trainLink = async (linkId: string) => {
  // Get the link object and see if it available;
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) {
    throw new Error("Link not found!");
  }

  // if it's training do nothing;
  if (link.status === "TRAINING") {
    return;
  }

  try {
    // change status to training
    await prisma.link.update({
      where: { id: link.id },
      data: { status: "TRAINING" },
    });

    // Delete all embeding for this link
    await prisma.document.deleteMany({ where: { linkId: link.id } });

    // fetch the website
    const docs = await getDocumentsFromWeb(new URL(link.url));
    await addDocuments(docs, link.chatbotId, linkId);

    // update the link status to success.
    await prisma.link.update({
      where: { id: linkId },
      data: { status: "TRAINED", lastTrainedAt: new Date() },
    });
  } catch (error: any) {
    await prisma.link.update({
      where: { id: linkId },
      data: {
        status: "ERROR",
        error: error.message || "Something went wrong!",
      },
    });
    console.log(error);
    throw error;
  }
};