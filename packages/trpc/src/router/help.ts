import { sendHelpRequestSchema } from "@acme/core/validators";
import { publicProcedure, router } from "../trpc";

export const helpRouter = router({
  sendRequest: publicProcedure.input(sendHelpRequestSchema).mutation((opts) => {
    return opts.ctx.db.helpRequest.create({
      data: opts.input,
    });
  }),
});
