import { TRPCError } from "@trpc/server";
import { qstash } from "@acme/upstash";
import { protectedProcedure, router } from "../trpc";
import * as z from "zod";
import { plans } from "@acme/plans";
import { trainLink } from "@acme/core";
import { PrismaClient } from "@acme/db";

const trainLinks = async (linkIds: string[], db: PrismaClient) => {
  if (process.env.NODE_ENV === "development") {
    await Promise.allSettled(linkIds.map((linkId) => trainLink(linkId, db)));
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
    .query(async ({ ctx, input: { chatbotId } }) => {
      const chatbot = await ctx.db.chatbot.findUnique({
        where: {
          id: chatbotId,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
        select: { id: true },
      });
      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }
      return ctx.db.link.findMany({
        where: { chatbot: { id: chatbot.id } },
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
      const chatbot = await ctx.db.chatbot.findUnique({
        where: {
          id: chatbotId,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
        select: {
          id: true,
          organization: { select: { id: true, plan: true } },
        },
      });

      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }

      const plan = plans.find((plan) => plan.id === chatbot.organization.plan);
      if (!plan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No subscription plan found! Please subscribe to a plan",
        });
      }

      if (plan.limits.links !== "unlimited") {
        const links = await ctx.db.link.count({
          where: {
            chatbot: { organizationId: chatbot.organization.id },
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
        data: { url: url, chatbotId: chatbot.id },
        select: { id: true },
      });
      await trainLinks([link.id], ctx.db);
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
      const chatbot = await ctx.db.chatbot.findUnique({
        where: {
          id: chatbotId,
          organization: { members: { some: { userId: ctx.session.user.id } } },
        },
        select: {
          id: true,
          organization: { select: { id: true, plan: true } },
        },
      });

      if (!chatbot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot not found!",
        });
      }

      const plan = plans.find((plan) => plan.id === chatbot.organization.plan);
      if (!plan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No subscription plan found! Please subscribe to a plan",
        });
      }

      if (plan.limits.links !== "unlimited") {
        const links = await ctx.db.link.count({
          where: {
            chatbot: { organizationId: chatbot.organization.id },
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
            data: { url, chatbotId: chatbot.id },
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
      await trainLinks(linkIds, ctx.db);
      return linkIds;
    }),
  retrain: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.findUnique({
        where: {
          id: input.id,
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
        select: { id: true },
      });
      if (!link) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Link not found!" });
      }
      await trainLinks([link.id], ctx.db);
      return link;
    }),
  retrainMany: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const links = await ctx.db.link.findMany({
        where: {
          id: { in: input.ids },
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
        select: { id: true },
      });
      await trainLinks(
        links.map((link) => link.id),
        ctx.db,
      );
      return links;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.link.delete({
        where: {
          id: input.id,
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
      });
    }),
  deleteMany: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.link.deleteMany({
        where: {
          id: { in: input.ids },
          chatbot: {
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
        },
      });
    }),
});
