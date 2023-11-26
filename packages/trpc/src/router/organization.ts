import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createOrgValidator, updateOrgValidator } from "@acme/core/validators";
import { getFirstAndLastDay } from "@acme/core/utils/get-first-and-last-day";
import { hasUserAccessToOrganization } from "./utils";

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
    .input(z.object({ orgSlug: z.string() }))
    .mutation(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
        ["OWNER"],
      );

      try {
        const deletedOrg = await opts.ctx.db.organization.delete({
          where: { id: organization.id },
        });
        return deletedOrg;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Something went wrong!",
        });
      }
    }),
  usage: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.organization.findUnique({
        where: {
          slug: input.orgSlug,
          members: { some: { userId: ctx.session.user.id } },
        },
        select: {
          id: true,
          billingCycleStartDay: true,
        },
      });
      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }
      const chatbotsCount = () =>
        ctx.db.chatbot.count({
          where: { organizationId: org.id },
        });

      const messagesPerMonthCount = async () => {
        let messagesPerMonth = 0;
        if (org.billingCycleStartDay) {
          const { firstDay, lastDay } = getFirstAndLastDay(
            org.billingCycleStartDay,
          );
          messagesPerMonth = await ctx.db.message.count({
            where: {
              conversation: { chatbot: { organizationId: org.id } },
              createdAt: {
                gte: firstDay,
                lte: lastDay,
              },
            },
          });
        }
        return messagesPerMonth;
      };

      const documentsCount = () =>
        ctx.db.document.count({
          where: { chatbot: { organizationId: org.id }, linkId: null },
        });

      const linksCount = () =>
        ctx.db.link.count({
          where: { chatbot: { organizationId: org.id } },
        });

      const teamMembersCount = () =>
        ctx.db.organizationMembership.count({
          where: { organizationId: org.id },
        });

      const [chatbots, messagesPerMonth, documents, links, teamMembers] =
        await Promise.all([
          chatbotsCount(),
          messagesPerMonthCount(),
          documentsCount(),
          linksCount(),
          teamMembersCount(),
        ]);

      return {
        chatbots,
        messagesPerMonth,
        documents,
        links,
        teamMembers,
      };
    }),
});
