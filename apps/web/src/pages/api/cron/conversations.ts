import { type NextApiRequest, type NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { prisma } from "@/server/prisma";
import { isBefore, subHours } from "date-fns";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        status: "OPEN",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const results = await Promise.allSettled(
      conversations.map(async (conversation) => {
        const lastMessage = await prisma.message.findFirst({
          where: { conversationId: conversation.id },
          select: {
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });

        const date = lastMessage
          ? lastMessage.createdAt
          : conversation.createdAt;

        if (isBefore(date, subHours(new Date(), 4))) {
          const prismaResponse = await prisma.conversation.update({
            where: { id: conversation.id },
            data: { status: "CLOSED", closedAt: new Date() },
          });

          return {
            prismaResponse,
          };
        }
      }),
    );

    return res.json(results);
  } catch (error: any) {
    return res.json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default verifySignature(handler);
