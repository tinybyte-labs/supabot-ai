import { errorResponse, successResponse } from "@/lib/response";
import { prisma } from "@/server/prisma";
import {
  CHATBOT_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} from "@/utils/constants/errors";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const chatbotId = req.query.chatbotId as string;
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });
    if (!chatbot) {
      throw res
        .status(404)
        .send(errorResponse("Chatbot fetch failed", CHATBOT_NOT_FOUND_ERROR));
    }
    return res
      .status(200)
      .send(successResponse("Chatbot fetch success", chatbot));
  } catch (error) {
    throw res
      .status(500)
      .send(errorResponse("Chatbot fetch failed", INTERNAL_SERVER_ERROR));
  }
}
