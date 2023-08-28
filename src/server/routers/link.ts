import { TRPCError } from "@trpc/server";
import qstash from "../qstash";
import { trainLink } from "../training";
import { protectedProcedure, router } from "../trpc";
import * as z from "zod";

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
    .query(({ ctx, input }) => {
      return ctx.db.link.findMany({
        where: {
          chatbotId: input.chatbotId,
        },
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

      const links = await Promise.allSettled(
        urls.map((url) =>
          ctx.db.link.create({
            data: { url, chatbotId },
            select: { id: true },
          }),
        ),
      );

      let linkIds = [];

      for (const link of links) {
        if (link.status === "fulfilled") {
          linkIds.push(link.value.id);
        }
      }

      await trainLinks(linkIds);

      return links;
    }),
  retrain: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        linkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, linkId } }) => {
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

      const link = await ctx.db.link.findUnique({
        where: { id: linkId, chatbotId },
        select: { id: true },
      });
      if (!link) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Link not found!" });
      }

      await trainLinks([link.id]);

      return link;
    }),
  retrainMany: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        linkIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, linkIds } }) => {
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

      const links = await ctx.db.link.findMany({
        where: { id: { in: linkIds }, chatbotId },
        select: { id: true },
      });

      await trainLinks(links.map((link) => link.id));

      return links;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        linkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, linkId } }) => {
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

      return ctx.db.link.delete({
        where: {
          id: linkId,
          chatbotId,
        },
      });
    }),
  deleteMany: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        linkIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input: { chatbotId, linkIds } }) => {
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

      return ctx.db.link.deleteMany({
        where: {
          id: { in: linkIds },
          chatbotId,
        },
      });
    }),
});
