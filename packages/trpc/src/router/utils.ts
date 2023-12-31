import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { Context } from "../trpc";
import { allPlans, freePlan } from "@acme/plans";
import { OrganizationMembershipRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  fetchUrlsFromSitemap,
  fetchUrlsFromWebsite,
} from "@acme/core/utils/fetch-urls";
import { contactSchema } from "@acme/core/validators";

export const utilsRouter = router({
  getLinksFromWebsite: protectedProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => fetchUrlsFromWebsite(input)),
  getLinksFromSitemap: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => fetchUrlsFromSitemap(input)),
  sendContactMail: publicProcedure.input(contactSchema).mutation((opts) => {
    const { email, message } = opts.input;
  }),
});

export const hasUserAccessToOrganization = async (
  slug: string,
  ctx: Context,
  roles?: OrganizationMembershipRole[],
) => {
  const userId = ctx.session?.user.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User id not found!",
    });
  }

  const organization = await ctx.db.organization.findUnique({
    where: { slug },
  });

  if (!organization) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found!",
    });
  }

  const member = await ctx.db.organizationMembership.findUnique({
    where: {
      userId_organizationId: { organizationId: organization.id, userId },
    },
    include: {
      user: true,
    },
  });

  if (!member) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You do not have access to this organization",
    });
  }

  if (roles && roles.length > 0 && !roles.includes(member.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have required role to performe this task. Required roles are: ${roles}`,
    });
  }

  const { user, ...memberData } = member;

  const plan =
    allPlans.find((plan) => plan.id === organization.plan) ?? freePlan;

  return {
    organization,
    member: memberData,
    user,
    plan,
  };
};

export const hasUserAccessToChatbot = async (
  chatbotId: string,
  ctx: Context,
  roles?: OrganizationMembershipRole[],
) => {
  const userId = ctx.session?.user.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User id not found!",
    });
  }

  const chatbot = await ctx.db.chatbot.findUnique({ where: { id: chatbotId } });
  if (!chatbot) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Chatbot not found!" });
  }

  const member = await ctx.db.organizationMembership.findUnique({
    where: {
      userId_organizationId: {
        userId: userId,
        organizationId: chatbot.organizationId,
      },
    },
    include: {
      organization: true,
      user: true,
    },
  });

  if (!member) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You do not have access to this chatbot",
    });
  }

  if (roles && roles.length > 0 && !roles.includes(member.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You do not have required role to performe this task. Required roles are: ${roles}`,
    });
  }

  const { organization, user, ...memberData } = member;

  const plan =
    allPlans.find((plan) => plan.id === organization.plan) ?? freePlan;

  return {
    chatbot,
    member: memberData,
    user,
    organization,
    plan,
  };
};
