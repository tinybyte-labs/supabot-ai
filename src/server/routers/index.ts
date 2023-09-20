import { router } from "../trpc";
import { chatbotRouter } from "./chatbot";
import { chatbotUserRouter } from "./chatbotUser";
import { clerkRouter } from "./clerk";
import { conversationRouter } from "./conversation";
import { feedbackRouter } from "./feedback";
import { linkRouter } from "./link";
import { messageRouter } from "./message";
import { organizationRouter } from "./organization";
import { quickPromptRouter } from "./quickPrompt";
import { stripeRouter } from "./stripe";
import { subscriptionRouter } from "./subscription";
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
  clerk: clerkRouter,
  subscription: subscriptionRouter,
  stripe: stripeRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
