import { router } from "../../trpc";
import { clerkWebhookRouter } from "./webhook";
import "@clerk/nextjs/api";

export const clerkRouter = router({
  webhooks: clerkWebhookRouter,
});
