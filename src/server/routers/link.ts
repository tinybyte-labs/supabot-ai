import { protectedProcedure, router } from "../trpc";
import * as z from "zod";

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
      });
    }),
  createOne: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.link.create({
        data: { url: input.url, chatbotId: input.chatbotId },
      });
      // Pass the link to qstash to train
      return link;
    }),
  createMany: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        urls: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createLinksPromise = input.urls.map((url) =>
        ctx.db.link.create({
          data: { url, chatbotId: input.chatbotId },
        }),
      );
      const links = await Promise.allSettled(createLinksPromise);
      // Pass the links to qstash to train
      // for(const link of links) {
      // }
      return links;
    }),
});
