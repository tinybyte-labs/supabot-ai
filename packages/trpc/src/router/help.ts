import { publicProcedure, router } from "../trpc";
import "@clerk/nextjs/api";
import { sendHelpRequestSchema } from "../validators";

export const helpRouter = router({
  sendRequest: publicProcedure.input(sendHelpRequestSchema).mutation((opts) => {
    return opts.ctx.db.helpRequest.create({
      data: opts.input,
    });
  }),
});
