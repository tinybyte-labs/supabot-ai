import { clerkEvent } from "@/server/clerkEvent";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const event = clerkEvent.safeParse(req.body);
    if (!event.success) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const ctx = await createContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    try {
      switch (event.data.type) {
        case "user.created":
          await caller.clerk.webhooks.userCreated(event.data.data);
          break;
        case "user.updated":
          await caller.clerk.webhooks.userUpdated(event.data.data);
          break;
        case "user.deleted":
          await caller.clerk.webhooks.userDeleted(event.data.data);
          break;
        case "organization.created":
          await caller.clerk.webhooks.organizationCreated(event.data.data);
          break;
        case "organization.updated":
          await caller.clerk.webhooks.organizationUpdated(event.data.data);
          break;
        case "organization.deleted":
          await caller.clerk.webhooks.organizationDeleted(event.data.data);
          break;
        case "organizationMembership.created":
          await caller.clerk.webhooks.organizationMembershipCreated(
            event.data.data,
          );
          break;
        case "organizationMembership.updated":
          await caller.clerk.webhooks.organizationMembershipUpdated(
            event.data.data,
          );
          break;
        case "organizationMembership.deleted":
          await caller.clerk.webhooks.organizationMembershipDeleted(
            event.data.data,
          );
          break;
        case "session.created":
          await caller.clerk.webhooks.sessionCreated(event.data.data);
          break;
        case "session.ended":
          await caller.clerk.webhooks.sessionEnded(event.data.data);
          break;
        case "session.removed":
          await caller.clerk.webhooks.sessionRemoved(event.data.data);
          break;
        case "session.revoked":
          await caller.clerk.webhooks.sessionRevoked(event.data.data);
          break;
        default:
          break;
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(500);
    }
  }
}
