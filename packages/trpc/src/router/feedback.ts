import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const feedbackRouter = router({
  send: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(500),
        url: z.string().url().optional(),
      }),
    )
    .mutation((opts) => {
      return opts.ctx.db.feedback.create({
        data: {
          message: opts.input.message,
          userId: opts.ctx.session.user.id,
          ...(opts.input.url ? { url: opts.input.url } : {}),
        },
      });
    }),
});
