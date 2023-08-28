import { router } from "../trpc";
import { chatbotRouter } from "./chatbot";
import { linkRouter } from "./link";
import { quickPromptRouter } from "./quickPrompt";
import { utilsRouter } from "./utils";

export const appRouter = router({
  chatbot: chatbotRouter,
  link: linkRouter,
  utils: utilsRouter,
  quickPrompt: quickPromptRouter,
});

export type AppRouter = typeof appRouter;
