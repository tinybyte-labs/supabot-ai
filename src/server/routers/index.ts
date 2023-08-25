import { router } from "../trpc";
import { chatbotRouter } from "./chatbot";

export const appRouter = router({
  chatbot: chatbotRouter,
});

export type AppRouter = typeof appRouter;
