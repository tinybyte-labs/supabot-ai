import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const messageRouter = router({
  list: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: { conversationId: input.conversationId },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
  react: publicProcedure
    .input(
      z.object({
        id: z.string(),
        reaction: z.enum(["LIKE", "DISLIKE"]).nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.message.update({
        where: { id: input.id },
        data: {
          reaction: input.reaction,
        },
      });
    }),
});
