import { z } from "zod";

export const userSchmea = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  last_sign_in_at: z.number().nullable(),
  email_addresses: z.array(
    z.object({
      email_address: z.string(),
    }),
  ),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().url().nullable(),
  profile_image_url: z.string().url().nullable(),
  public_metadata: z.any().nullable(),
});

export const organizationSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  slug: z.string(),
  name: z.string().nullable(),
  created_by: z.string(),
  image_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  public_metadata: z.any().nullable(),
});

export const organizationMembershipSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  role: z.string(),
  organization: z.object({
    id: z.string(),
  }),
  public_user_data: z.object({
    user_id: z.string(),
  }),
});

export const sessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  expire_at: z.number(),
  last_active_at: z.number(),
  status: z.string(),
});

export const clerkEvent = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user.created"),
    data: userSchmea,
  }),
  z.object({
    type: z.literal("user.updated"),
    data: userSchmea,
  }),
  z.object({
    type: z.literal("user.deleted"),
    data: z.object({ id: z.string() }),
  }),
  z.object({
    type: z.literal("organization.created"),
    data: organizationSchema,
  }),
  z.object({
    type: z.literal("organization.updated"),
    data: organizationSchema,
  }),
  z.object({
    type: z.literal("organization.deleted"),
    data: z.object({ id: z.string() }),
  }),
  z.object({
    type: z.literal("organizationMembership.created"),
    data: organizationMembershipSchema,
  }),
  z.object({
    type: z.literal("organizationMembership.updated"),
    data: organizationMembershipSchema,
  }),
  z.object({
    type: z.literal("organizationMembership.deleted"),
    data: z.object({ id: z.string() }),
  }),
  z.object({
    type: z.literal("session.created"),
    data: sessionSchema,
  }),
  z.object({
    type: z.literal("session.ended"),
    data: sessionSchema,
  }),
  z.object({
    type: z.literal("session.revoked"),
    data: sessionSchema,
  }),
  z.object({
    type: z.literal("session.removed"),
    data: sessionSchema,
  }),
]);
