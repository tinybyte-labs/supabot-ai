import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { createOrgValidator } from "@acme/core";

export const organizationRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query((opts) => {
      return opts.ctx.db.organization.findFirst({
        where: {
          id: opts.input.id,
          members: { some: { userId: opts.ctx.session.user.id } },
        },
      });
    }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query((opts) => {
      return opts.ctx.db.organization.findFirst({
        where: {
          slug: opts.input.slug,
          members: { some: { userId: opts.ctx.session.user.id } },
        },
      });
    }),
  getAll: protectedProcedure.query((opts) => {
    return opts.ctx.db.organization.findMany({
      where: { members: { some: { userId: opts.ctx.session.user.id } } },
    });
  }),
  create: protectedProcedure.input(createOrgValidator).mutation((opts) => {
    return opts.ctx.db.organization.create({
      data: {
        ...opts.input,
        members: {
          create: {
            role: "OWNER",
            userId: opts.ctx.session.user.id,
          },
        },
      },
    });
  }),
});
