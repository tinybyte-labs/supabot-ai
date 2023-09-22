import { router } from "@/server/trpc";
import { clerkWebhookRouter } from "./webhook";

export const clerkRouter = router({
  webhooks: clerkWebhookRouter,
});
