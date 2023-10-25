import { chatbotRouter } from "./router/chatbot";
import { conversationRouter } from "./router/conversation";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chatbot: chatbotRouter,
  conversation: conversationRouter,
});

export type AppRouter = typeof appRouter;
