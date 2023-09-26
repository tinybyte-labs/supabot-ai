import { TRPCError } from "@trpc/server";
import { stripeWebhookRouter } from "./webhook";
import { stripe } from "@/server/stripe";
import { BASE_DOMAIN } from "@/utils/constants";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";

const getCustomer = async (db: PrismaClient, orgId: string, userId: string) => {
  const org = await db.organization.findUnique({
    where: { id: orgId },
  });
  if (!org) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found!",
    });
  }
  const user = await db.user.findUnique({
    where: { id: userId, organizations: { some: { organizationId: org.id } } },
  });
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
  }
  let customerId = org.customerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { orgId: org.id, userId: user.id, userEmail: user.email },
      name: org.name || "",
      email: user?.email || "",
    });
    customerId = customer.id;
    await db.organization.update({
      where: { id: org.id },
      data: { customerId },
    });
  }
  return customerId;
};

export const stripeRouter = router({
  webhooks: stripeWebhookRouter,
  getCustomerPortal: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth.orgId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No organization selected",
      });
    }
    const customerId = await getCustomer(
      ctx.db,
      ctx.auth.orgId,
      ctx.auth.userId,
    );
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${BASE_DOMAIN}/plan-billing`,
    });
    return session;
  }),
  getCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No organization selected",
        });
      }
      const customerId = await getCustomer(
        ctx.db,
        ctx.auth.orgId,
        ctx.auth.userId,
      );
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: input.priceId, quantity: 1 }],
        success_url: `${BASE_DOMAIN}/plan-billing?success=true`,
        cancel_url: `${BASE_DOMAIN}/plan-billing?canceled=true`,
      });
      return session;
    }),
});
