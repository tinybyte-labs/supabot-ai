import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { chatbotUserLogInValidator } from "@acme/core";
import "@clerk/nextjs/api";

export const chatbotUserRouter = router({
  logIn: publicProcedure
    .input(chatbotUserLogInValidator)
    .mutation(async ({ ctx, input }) => {
      if (input.email) {
        const alreadyExists = await ctx.db.chatbotUser.findUnique({
          where: {
            chatbotId_email: {
              chatbotId: input.chatbotId,
              email: input.email,
            },
          },
          select: { id: true },
        });
        if (alreadyExists) {
          return ctx.db.chatbotUser.update({
            where: { id: alreadyExists.id },
            data: {
              ...(input.name ? { name: input.name } : {}),
            },
          });
        }
      }
      return ctx.db.chatbotUser.create({
        data: {
          chatbotId: input.chatbotId,
          email: input.email,
          ...(input.name ? { name: input.name } : {}),
        },
      });
    }),
  getUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.chatbotUser.findUnique({ where: { id: input } });
  }),
  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        data: z.object({
          name: z.string().max(100).optional(),
        }),
      }),
    )
    .mutation((opts) => {
      return opts.ctx.db.chatbotUser.update({
        where: { id: opts.input.userId },
        data: opts.input.data,
      });
    }),
  list: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.chatbotUser.findMany({
        where: {
          chatbot: { id: input.chatbotId, organizationId: ctx.auth.orgId },
        },
        include: { _count: { select: { conversations: true } } },
      });
    }),
  blockUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        blocked: z.boolean().default(true),
      }),
    )
    .mutation(async (opts) => {
      if (!opts.ctx.auth.orgId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No org selected" });
      }
      const user = await opts.ctx.db.chatbotUser.findUnique({
        where: {
          id: opts.input.userId,
          chatbot: {
            organizationId: opts.ctx.auth.orgId,
          },
        },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
      }
      return opts.ctx.db.chatbotUser.update({
        where: { id: user.id },
        data: {
          blocked: opts.input.blocked,
        },
      });
    }),
});
