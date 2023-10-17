import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { chatbotUserLogInValidator } from "@acme/core/validators";

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
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.chatbotUser.findUnique({
        where: { id: input.userId },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chatbot user not found!",
        });
      }
      return user;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().max(100).optional(),
        }),
      }),
    )
    .mutation((opts) => {
      return opts.ctx.db.chatbotUser.update({
        where: { id: opts.input.id },
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
          chatbot: {
            id: input.chatbotId,
            organization: {
              members: { some: { userId: ctx.session.user.id } },
            },
          },
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
      const user = await opts.ctx.db.chatbotUser.findUnique({
        where: {
          id: opts.input.userId,
          chatbot: {
            organization: {
              members: {
                some: {
                  userId: opts.ctx.session.user.id,
                  role: {
                    in: ["OWNER", "ADMIN"],
                  },
                },
              },
            },
          },
        },
        select: { id: true },
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
