import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { appRouter } from "@acme/trpc/src/router";
import { createContext } from "@acme/trpc/src/trpc";
import { stripe } from "@acme/trpc/src/stripe";

export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    throw new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Successfully constructed event
  console.log("✅ Success:", event.type);
  const ctx = await createContext({ req });
  const caller = appRouter.createCaller(ctx);

  switch (event.type) {
    case "checkout.session.completed":
      await caller.stripe.webhooks.checkoutSessionCompleted({ event });
      break;
    case "customer.subscription.deleted":
      await caller.stripe.webhooks.customerSubscriptionDeleted({ event });
      break;
  }

  return new NextResponse("OK");
};
