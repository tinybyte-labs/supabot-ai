import { NextApiRequest, NextApiResponse } from "next";
import Cors from "micro-cors";
import type Stripe from "stripe";
import { buffer } from "micro";
import { stripe } from "@acme/trpc";
import { api } from "@/trpc/server";

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

    switch (event.type) {
      case "checkout.session.completed":
        await api.stripe.webhooks.checkoutSessionCompleted.mutate({ event });
        break;
      case "customer.subscription.deleted":
        await api.stripe.webhooks.customerSubscriptionDeleted.mutate({ event });
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
