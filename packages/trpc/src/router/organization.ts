import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createOrgValidator, updateOrgValidator } from "@acme/core/validators";

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
          message: error.message || "Something went wrong!",
        });
      }
    }),

  update: protectedProcedure
    .input(updateOrgValidator)
    .mutation(async (opts) => {
      const org = await opts.ctx.db.organization.findUnique({
        where: {
          id: opts.input.id,
          members: {
            some: {
              userId: opts.ctx.session.user.id,
            },
          },
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      try {
        const updatedOrg = await opts.ctx.db.organization.update({
          where: { id: org.id },
          data: {
            ...(typeof opts.input.name !== "undefined"
              ? { name: opts.input.name }
              : {}),
            ...(typeof opts.input.slug !== "undefined"
              ? { slug: opts.input.slug }
              : {}),
          },
        });
        return updatedOrg;
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Slug is already in use.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Something went wrong!",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const org = await opts.ctx.db.organization.findUnique({
        where: { id: opts.input.id },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      const member = await opts.ctx.db.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: opts.ctx.session.user.id,
            organizationId: org.id,
          },
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this organization",
        });
      }

      if (member.role !== "OWNER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owner can delete their organization.",
        });
      }

      try {
        const deletedOrg = await opts.ctx.db.organization.delete({
          where: { id: org.id },
        });
        return deletedOrg;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Something went wrong!",
        });
      }
    }),
});
