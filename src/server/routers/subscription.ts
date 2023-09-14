import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { getFirstAndLastDay } from "@/utils/getStartAndLastDate";
import { plans } from "@/data/plans";

export const subscriptionRouter = router({
  plan: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.orgId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No organization selected",
      });
    }
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.auth.orgId },
      select: { plan: true },
    });
    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found!",
      });
    }
    return plans.find((plan) => plan.id === org.plan);
  }),
  usage: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.auth.orgId;
    if (!orgId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No organization selected",
      });
    }
    const org = await ctx.db.organization.findUnique({
      where: { id: orgId },
      select: {
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
        where: { organizationId: orgId },
      });

    const messagesPerMonthCount = async () => {
      let messagesPerMonth = 0;
      if (org.billingCycleStartDay) {
        const { firstDay, lastDay } = getFirstAndLastDay(
          org.billingCycleStartDay,
        );
        messagesPerMonth = await ctx.db.message.count({
          where: {
            conversation: { chatbot: { organizationId: orgId } },
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
        where: { chatbot: { organizationId: orgId }, linkId: null },
      });

    const linksCount = () =>
      ctx.db.link.count({
        where: { chatbot: { organizationId: orgId } },
      });

    const teamMembersCount = () =>
      ctx.db.organizationMembership.count({ where: { organizationId: orgId } });

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
