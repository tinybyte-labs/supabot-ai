import { TRPCError } from "@trpc/server";
import { qstash } from "@acme/upstash";
import { protectedProcedure, router } from "../trpc";
import * as z from "zod";
import { plans } from "@acme/plans";
import { trainLink } from "../utils";
import "@clerk/nextjs/api";

const trainLinks = async (linkIds: string[]) => {
  if (process.env.NODE_ENV === "development") {
    await Promise.allSettled(linkIds.map((linkId) => trainLink(linkId)));
  } else {
    await Promise.allSettled(
      linkIds.map((linkId) =>
        qstash.publishJSON({
          body: {
            linkId,
          },
          topic: "train-link",
        }),
      ),
    );
  }
};

export const linkRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
    .query(({ ctx, input: { chatbotId } }) => {
      return ctx.db.link.findMany({
        where: { chatbot: { id: chatbotId, organizationId: ctx.auth.orgId } },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
  createOne: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, url } }) => {
      const orgId = ctx.auth.orgId;
      if (!orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No organization selected",
        });
      }
      const org = await ctx.db.organization.findUnique({
        where: { id: orgId },
        select: {
          plan: true,
          billingCycleStartDay: true,
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }

      const chatbot = await ctx.db.chatbot.findFirst({
        where: { id: chatbotId, organizationId: ctx.auth.orgId },
        select: { id: true },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }

      const plan = plans.find((plan) => plan.id === org.plan);
      if (!plan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No subscription plan found! Please subscribe to a plan",
        });
      }

      if (plan.limits.links !== "unlimited") {
        const links = await ctx.db.link.count({
          where: {
            chatbot: { organizationId: orgId },
          },
        });
        if (links >= plan.limits.links) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Link creation limit reached",
          });
        }
      }

      const link = await ctx.db.link.create({
        data: { url: url, chatbotId },
        select: { id: true },
      });
      await trainLinks([link.id]);
      return link;
    }),
  createMany: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        urls: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, urls } }) => {
      const orgId = ctx.auth.orgId;
      if (!orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No organization selected",
        });
      }
      const org = await ctx.db.organization.findUnique({
        where: { id: orgId },
        select: {
          plan: true,
          billingCycleStartDay: true,
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      const chatbot = await ctx.db.chatbot.findFirst({
        where: { id: chatbotId, organizationId: ctx.auth.orgId },
        select: { id: true },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }

      const plan = plans.find((plan) => plan.id === org.plan);
      if (!plan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No subscription plan found! Please subscribe to a plan",
        });
      }

      if (plan.limits.links !== "unlimited") {
        const links = await ctx.db.link.count({
          where: {
            chatbot: { organizationId: orgId },
          },
        });
        if (links + urls.length > plan.limits.links) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Link creation limit reached",
          });
        }
      }

      const links = await Promise.allSettled(
        urls.map((url) =>
          ctx.db.link.create({
            data: { url, chatbotId },
            select: { id: true },
          }),
        ),
      );
      let linkIds: string[] = [];
      for (const link of links) {
        if (link.status === "fulfilled") {
          linkIds.push(link.value.id);
        }
      }
      await trainLinks(linkIds);
      return linkIds;
    }),
  retrain: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.findFirstOrThrow({
        where: { id: input, chatbot: { organizationId: ctx.auth.orgId } },
        select: { id: true },
      });
      await trainLinks([link.id]);
      return link;
    }),
  retrainMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const links = await ctx.db.link.findMany({
        where: {
          id: { in: input },
          chatbot: { organizationId: ctx.auth.orgId },
        },
        select: { id: true },
      });
      await trainLinks(links.map((link) => link.id));
      return links;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.link.delete({
        where: { id: input, chatbot: { organizationId: ctx.auth.orgId } },
      });
    }),
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.link.deleteMany({
        where: {
          id: { in: input },
          chatbot: { organizationId: ctx.auth.orgId },
        },
      });
    }),
});
