import { db } from "@acme/db";
import { NextRequest, NextResponse } from "next/server";
import { getScript } from "./utils";

export const GET = async (req: NextRequest) => {
  const chatbotId = req.nextUrl.searchParams.get("id") as string;
  if (!chatbotId) {
    throw new NextResponse("id query params is required", { status: 400 });
  }

  const chatbot = await db.chatbot.findUnique({ where: { id: chatbotId } });
  if (!chatbot) {
    throw new NextResponse("Chatbot not found!", { status: 404 });
  }

  const script = await getScript(chatbot);

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
};
