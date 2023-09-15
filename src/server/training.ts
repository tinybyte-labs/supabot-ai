import { prisma } from "./prisma";
import { addDocuments } from "@/server/vector-store";
import { convert } from "html-to-text";
import { splitDocumentIntoChunks } from "@/utils/splitDocumentIntoChunks";

const getDocumentsFromWeb = async (url: URL) => {
  const res = await fetch(url);
  const htmlText = await res.text();
  const rawText = convert(htmlText, {
    selectors: [
      {
        selector: "a",
        options: {
          baseUrl: url.origin,
        },
      },
    ],
  });
  const chunks = splitDocumentIntoChunks(rawText, 500, 50);
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
    throw new Error("Link is already in training!");
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
    throw error;
  }
};
