import { stripe } from "../../stripe";
import { publicProcedure, router } from "../../trpc";
import { planFromPriceId } from "../../utils";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import "@clerk/nextjs/api";

const webhookProcedure = publicProcedure.input(
  z.object({
    // From type Stripe.Event
    event: z.object({
      id: z.string(),
      account: z.string().nullish(),
      created: z.number(),
      data: z.object({
        object: z.record(z.any()),
      }),
      type: z.string(),
    }),
  }),
);

export const stripeWebhookRouter = router({
  checkoutSessionCompleted: webhookProcedure.mutation(async (opts) => {
    const session = opts.input.event.data.object as Stripe.Checkout.Session;
    if (typeof session.subscription !== "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing or invalid subscription id",
      });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );
    if (subscription.status === "active") {
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;
      const result = await opts.ctx.db.organization.findUnique({
        where: { customerId },
      });
      if (!result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }
      const priceId = subscription.items.data[0].price.id;
      const plan = planFromPriceId(priceId);
      if (!plan) return;
      await opts.ctx.db.organization.update({
        where: { id: result.id },
        data: {
          plan: plan.id,
          priceId,
          subscriptionId: subscription.id,
          billingCycleStartDay: new Date().getDate(),
        },
      });
    }
  }),
  customerSubscriptionDeleted: webhookProcedure.mutation(async (opts) => {
    const subscription = opts.input.event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    await opts.ctx.db.organization.update({
      where: { customerId },
      data: {
        plan: "free",
        subscriptionId: null,
        priceId: null,
        billingCycleStartDay: new Date().getDate(),
      },
    });
  }),
});
