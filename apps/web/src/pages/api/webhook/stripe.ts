import { NextApiRequest, NextApiResponse } from "next";
import Cors from "micro-cors";
import type Stripe from "stripe";
import { buffer } from "micro";
import { createContext, appRouter, stripe } from "@acme/trpc";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || "",
      );
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log("✅ Success:", event.type);

    const ctx = await createContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    switch (event.type) {
      case "checkout.session.completed":
        caller.stripe.webhooks.checkoutSessionCompleted({ event });
        break;
      case "customer.subscription.deleted":
        caller.stripe.webhooks.customerSubscriptionDeleted({ event });
        break;
      default:
        console.log("Unhandled Stripe Event", {
          id: event.id,
          type: event.type,
        });
        break;
    }
  }
};

export default cors(handler as any);
