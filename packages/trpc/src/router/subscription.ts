import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { getFirstAndLastDay } from "@acme/core/utils/get-first-and-last-day";

export const subscriptionRouter = router({
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
