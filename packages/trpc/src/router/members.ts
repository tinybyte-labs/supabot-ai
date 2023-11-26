import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { hasUserAccessToOrganization } from "./utils";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { OrganizationInvite, resend } from "@acme/emails";
import { APP_NAME } from "../constants";
import { hashToken } from "@acme/auth";

export const membersRouter = router({
  getAllMembersByOrgSlug: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
      );
      const members = await opts.ctx.db.organizationMembership.findMany({
        where: { organizationId: organization.id },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return members;
    }),
  getAllInvitesByOrgSlug: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .query(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
      );
      const invites = await opts.ctx.db.organizationInvite.findMany({
        where: { organizationId: organization.id },
        orderBy: {
          createdAt: "desc",
        },
      });
      return invites;
    }),
  inviteTeammate: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      const { organization, user } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
        ["OWNER"],
      );

      const userExists = await opts.ctx.db.user.findUnique({
        where: { email: opts.input.email },
      });

      if (userExists) {
        const alreadyInOrg =
          await opts.ctx.db.organizationMembership.findUnique({
            where: {
              userId_organizationId: {
                userId: userExists.id,
                organizationId: organization.id,
              },
            },
          });

        if (alreadyInOrg) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User already exists in this organization.",
          });
        }
      }

      const token = randomBytes(32).toString("hex");
      const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;
      const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);

      try {
        await opts.ctx.db.organizationInvite.create({
          data: {
            email: opts.input.email,
            organizationId: organization.id,
            expires,
          },
        });
      } catch (err: any) {
        if (err.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User has already been invited to this organization",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }

      await opts.ctx.db.verificationToken.create({
        data: {
          identifier: opts.input.email,
          expires,
          token: hashToken(token),
        },
      });

      const params = new URLSearchParams({
        callbackUrl: `${process.env.NEXTAUTH_URL}/${organization.slug}`,
        email: opts.input.email,
        token,
      });
      const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

      if (process.env.NODE_ENV === "production") {
        await resend.emails.send({
          from: "SupaBot AI <system@supabotai.com>",
          subject: `You've been invited to join a organization on ${APP_NAME}`,
          to: opts.input.email,
          react: OrganizationInvite({
            email: opts.input.email,
            organizationName: organization.name,
            url,
            organizationUser: user.name,
            organizationUserEmail: user.email,
          }),
        });
      } else {
        console.log(`Invitation Link ${url}`);
      }
    }),
  revokeInvitation: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
        ["OWNER"],
      );
      await opts.ctx.db.organizationInvite.delete({
        where: {
          email_organizationId: {
            email: opts.input.email,
            organizationId: organization.id,
          },
        },
      });
    }),
  checkInvitation: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string(),
      }),
    )
    .query(async (opts) => {
      const org = await opts.ctx.db.organization.findUnique({
        where: { slug: opts.input.orgSlug },
      });

      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }

      const invite = await opts.ctx.db.organizationInvite.findUnique({
        where: {
          email_organizationId: {
            email: opts.ctx.session.user.email ?? "",
            organizationId: org.id,
          },
        },
      });
      console.log({ org, invite });
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found!",
        });
      }
      return invite;
    }),
  acceptInvite: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const org = await opts.ctx.db.organization.findUnique({
        where: { slug: opts.input.orgSlug },
      });

      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found!",
        });
      }

      const invite = await opts.ctx.db.organizationInvite.findUnique({
        where: {
          email_organizationId: {
            email: opts.ctx.session.user.email ?? "",
            organizationId: org.id,
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found!",
        });
      }

      await opts.ctx.db.organizationInvite.delete({
        where: {
          email_organizationId: {
            email: opts.ctx.session.user.email ?? "",
            organizationId: org.id,
          },
        },
      });

      return await opts.ctx.db.organizationMembership.create({
        data: {
          organizationId: org.id,
          userId: opts.ctx.session.user.id,
        },
      });
    }),
  leaveOrg: protectedProcedure
    .input(z.object({ orgSlug: z.string() }))
    .mutation(async (opts) => {
      const { member } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
      );
      if (member.role === "OWNER") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Cannot remove owner from organization. Please transfer ownership to another user first.",
        });
      }
      return await opts.ctx.db.organizationMembership.delete({
        where: {
          userId_organizationId: {
            userId: member.userId,
            organizationId: member.organizationId,
          },
        },
      });
    }),
  removeMember: protectedProcedure
    .input(z.object({ orgSlug: z.string(), userId: z.string() }))
    .mutation(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
        ["OWNER"],
      );

      const member = await opts.ctx.db.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: opts.input.userId,
            organizationId: organization.id,
          },
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found!",
        });
      }

      if (member.role === "OWNER") {
        const ownerCount = await opts.ctx.db.organizationMembership.count({
          where: { organizationId: organization.id, role: "OWNER" },
        });

        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Ownership must be transferred before removing the organization owner`,
          });
        }
      }

      return await opts.ctx.db.organizationMembership.delete({
        where: {
          userId_organizationId: {
            userId: member.userId,
            organizationId: member.organizationId,
          },
        },
      });
    }),
  chagneMemberRole: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string(),
        userId: z.string(),
        role: z.enum(["OWNER", "MEMBER"]),
      }),
    )
    .mutation(async (opts) => {
      const { organization } = await hasUserAccessToOrganization(
        opts.input.orgSlug,
        opts.ctx,
        ["OWNER"],
      );

      const member = await opts.ctx.db.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: opts.input.userId,
            organizationId: organization.id,
          },
        },
      });

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found!",
        });
      }

      if (
        opts.input.userId === opts.ctx.session.user.id &&
        opts.input.role !== "OWNER"
      ) {
        const ownerCount = await opts.ctx.db.organizationMembership.count({
          where: { organizationId: organization.id, role: "OWNER" },
        });
        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `You must make someone else an owner before changing this member's role`,
          });
        }
      }

      return await opts.ctx.db.organizationMembership.update({
        where: {
          userId_organizationId: {
            userId: member.userId,
            organizationId: member.organizationId,
          },
        },
        data: {
          role: opts.input.role,
        },
      });
    }),
});
