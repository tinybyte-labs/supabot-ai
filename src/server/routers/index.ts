import { router } from "../trpc";
import { chatbotRouter } from "./chatbot";
import { linkRouter } from "./link";
import { utilsRouter } from "./utils";

export const appRouter = router({
  chatbot: chatbotRouter,
  link: linkRouter,
  utils: utilsRouter,
});

export type AppRouter = typeof appRouter;
