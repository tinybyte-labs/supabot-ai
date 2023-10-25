import { chatbotRouter } from "./router/chatbot";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  chatbot: chatbotRouter,
});

export type AppRouter = typeof appRouter;
