import { prisma } from "./prisma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { HtmlToTextTransformer } from "langchain/document_transformers/html_to_text";
import { type Document, addDocuments } from "@/server/vector-store";

const getDocumentsFromWeb = async (url: string): Promise<Document[]> => {
  const loader = new CheerioWebBaseLoader(url);
  const htmlDocs = await loader.load();

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new HtmlToTextTransformer();

  const sequence = splitter.pipe(transformer);

  const docs = await sequence.invoke(htmlDocs);
  return docs
    .filter((doc) => Boolean(doc.pageContent))
    .map((doc) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    }));
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
    const docs = await getDocumentsFromWeb(link.url);
    console.log(docs);
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
