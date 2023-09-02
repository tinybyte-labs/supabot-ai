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
    console.log("Clerk Event:", event.data.type);
    console.log(event.data);

    switch (event.data.type) {
      case "user.created":
        await caller.clerk.userCreated(event.data.data);
        break;
      case "user.updated":
        await caller.clerk.userUpdated(event.data.data);
        break;
      case "user.deleted":
        await caller.clerk.userDeleted(event.data.data);
        break;
      case "organization.created":
        await caller.clerk.organizationCreated(event.data.data);
        break;
      case "organization.updated":
        await caller.clerk.organizationUpdated(event.data.data);
        break;
      case "organization.deleted":
        await caller.clerk.organizationDeleted(event.data.data);
        break;
      case "organizationMembership.created":
        await caller.clerk.organizationMembershipCreated(event.data.data);
        break;
      case "organizationMembership.updated":
        await caller.clerk.organizationMembershipUpdated(event.data.data);
        break;
      case "organizationMembership.deleted":
        await caller.clerk.organizationMembershipDeleted(event.data.data);
        break;
      case "session.created":
        await caller.clerk.sessionCreated(event.data.data);
        break;
      case "session.ended":
        await caller.clerk.sessionEnded(event.data.data);
        break;
      case "session.removed":
        await caller.clerk.sessionRemoved(event.data.data);
        break;
      case "session.revoked":
        await caller.clerk.sessionRevoked(event.data.data);
        break;
      default:
        break;
    }

    return res.json({ success: true });
  }
}
