import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const organizationRouter = router({
  getOrg: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query((opts) => {
      return opts.ctx.db.organization.findFirst({
        where: {
          slug: opts.input.orgSlug,
          members: { some: { userId: opts.ctx.auth.userId } },
        },
      });
    }),
});
