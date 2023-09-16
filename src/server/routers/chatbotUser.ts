import { chatbotUserLogInValidator } from "@/utils/validators";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

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
});
