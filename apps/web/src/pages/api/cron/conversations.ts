import { type NextApiRequest, type NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { isBefore, subHours } from "date-fns";
import { db } from "@acme/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const conversations = await db.conversation.findMany({
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
        const lastMessage = await db.message.findFirst({
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
          const prismaResponse = await db.conversation.update({
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
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default verifySignature(handler);
