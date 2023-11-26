import { router } from "../trpc";
import { chatbotRouter } from "./chatbot";
import { chatbotUserRouter } from "./chatbotUser";
import { conversationRouter } from "./conversation";
import { feedbackRouter } from "./feedback";
import { helpRouter } from "./help";
import { linkRouter } from "./link";
import { membersRouter } from "./members";
import { messageRouter } from "./message";
import { organizationRouter } from "./organization";
import { quickPromptRouter } from "./quickPrompt";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";
import { utilsRouter } from "./utils";

export const appRouter = router({
  organization: organizationRouter,
  chatbot: chatbotRouter,
  link: linkRouter,
  utils: utilsRouter,
  quickPrompt: quickPromptRouter,
  conversation: conversationRouter,
  chatbotUser: chatbotUserRouter,
  message: messageRouter,
  stripe: stripeRouter,
  feedback: feedbackRouter,
  help: helpRouter,
  user: userRouter,
  members: membersRouter,
});

export type AppRouter = typeof appRouter;
