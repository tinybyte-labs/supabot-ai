import { publicProcedure, router } from "../trpc";
import { sendHelpRequestSchema } from "@acme/core";

export const helpRouter = router({
  sendRequest: publicProcedure.input(sendHelpRequestSchema).mutation((opts) => {
    return opts.ctx.db.helpRequest.create({
      data: opts.input,
    });
  }),
});
