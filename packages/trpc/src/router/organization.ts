import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { createOrgValidator } from "@acme/core";
import { TRPCError } from "@trpc/server";

export const organizationRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const org = await opts.ctx.db.organization.findFirst({
        where: {
          id: opts.input.id,
          members: { some: { userId: opts.ctx.session.user.id } },
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      return org;
    }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      const org = await opts.ctx.db.organization.findFirst({
        where: {
          slug: opts.input.slug,
          members: { some: { userId: opts.ctx.session.user.id } },
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      return org;
    }),
  getAll: protectedProcedure.query((opts) => {
    return opts.ctx.db.organization.findMany({
      where: { members: { some: { userId: opts.ctx.session.user.id } } },
    });
  }),
  create: protectedProcedure
    .input(createOrgValidator)
    .mutation(async (opts) => {
      try {
        const newOrg = await opts.ctx.db.organization.create({
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
        return newOrg;
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "The slug is already taken!",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
});
