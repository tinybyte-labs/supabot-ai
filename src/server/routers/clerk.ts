import { z } from "zod";
import {
  organizationMembershipSchema,
  organizationSchema,
  sessionSchema,
  userSchmea,
} from "../clerkEvent";
import { publicProcedure, router } from "../trpc";
import { WelcomeEmail, sendEmail } from "@/lib/email";
import { APP_NAME } from "@/utils/constants";

export const clerkRouter = router({
  userCreated: publicProcedure
    .input(userSchmea)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.create({
        data: {
          id: input.id,
          email: input.email_addresses[0].email_address,
          firstName: input.first_name,
          lastName: input.last_name,
          lastSignInAt: input.last_sign_in_at
            ? new Date(input.last_sign_in_at)
            : null,
          imageUrl: input.image_url,
          profileImageUrl: input.profile_image_url,
          publicMetadata: input.public_metadata,
        },
      });

      const email = input.email_addresses[0].email_address;
      await sendEmail({
        from: "Rohid <rohid@supabotai.com>",
        subject: `Welcome to ${APP_NAME} 👋`,
        to: [email],
        react: WelcomeEmail({ email }),
      });
    }),
  userUpdated: publicProcedure.input(userSchmea).mutation(({ ctx, input }) =>
    ctx.db.user.update({
      where: { id: input.id },
      data: {
        email: input.email_addresses[0].email_address,
        firstName: input.first_name,
        lastName: input.last_name,
        lastSignInAt: input.last_sign_in_at
          ? new Date(input.last_sign_in_at)
          : null,
        imageUrl: input.image_url,
        profileImageUrl: input.profile_image_url,
        publicMetadata: input.public_metadata,
      },
    }),
  ),
  userDeleted: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.user.delete({ where: { id: input.id } }),
    ),
  organizationCreated: publicProcedure
    .input(organizationSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.organization.create({
        data: {
          id: input.id,
          slug: input.slug,
          name: input.name,
          imageUrl: input.image_url,
          logoUrl: input.logo_url,
          createdBy: input.created_by,
          publicMetadata: input.public_metadata,
          billingCycleStartDay: new Date().getDate(),
        },
      }),
    ),
  organizationUpdated: publicProcedure
    .input(organizationSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.organization.update({
        where: { id: input.id },
        data: {
          slug: input.slug,
          name: input.name,
          imageUrl: input.image_url,
          logoUrl: input.logo_url,
          createdBy: input.created_by,
          publicMetadata: input.public_metadata,
        },
      }),
    ),
  organizationDeleted: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.organization.delete({ where: { id: input.id } }),
    ),
  organizationMembershipCreated: publicProcedure
    .input(organizationMembershipSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.organizationMembership.create({
        data: {
          id: input.id,
          organizationId: input.organization.id,
          userId: input.public_user_data.user_id,
          role: input.role,
        },
      }),
    ),
  organizationMembershipUpdated: publicProcedure
    .input(organizationMembershipSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.organizationMembership.update({
        where: { id: input.id },
        data: {
          role: input.role,
        },
      }),
    ),
  organizationMembershipDeleted: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.organizationMembership.delete({ where: { id: input.id } }),
    ),
  sessionCreated: publicProcedure
    .input(sessionSchema)
    .mutation(({ ctx, input }) => {}),
  sessionRevoked: publicProcedure
    .input(sessionSchema)
    .mutation(({ ctx, input }) => {}),
  sessionRemoved: publicProcedure
    .input(sessionSchema)
    .mutation(({ ctx, input }) => {}),
  sessionEnded: publicProcedure
    .input(sessionSchema)
    .mutation(({ ctx, input }) => {}),
});
