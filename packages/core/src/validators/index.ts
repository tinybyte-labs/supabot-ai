import * as z from "zod";

export const createOrgValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters."),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters.")
    .max(32, "Slug must be at most 32 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g, "Invalid slug"),
});

export type CreateOrgDto = z.infer<typeof createOrgValidator>;
export const updateOrgValidator = z.object({
  id: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters.")
    .optional(),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters.")
    .max(32, "Slug must be at most 32 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g, "Invalid slug")
    .optional(),
});
export type UpdateOrgDto = z.infer<typeof updateOrgValidator>;

export const createChatbotValidator = z.object({
  orgSlug: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters."),
});

export type CreateChatbotDto = z.infer<typeof createChatbotValidator>;

export const chatbotSettingsSchema = z.object({
  greetingText: z.string().max(100).optional(),
  welcomeMessage: z.string().max(500).optional(),
  placeholderText: z.string().max(80).optional(),
  primaryColor: z.string().optional(),
  primaryForegroundColor: z.string().optional(),
  position: z.enum(["left", "right"]).optional(),
  mx: z.number().optional(),
  my: z.number().optional(),
  theme: z.enum(["light", "dark"]).default("light").optional(),
});

export type ChatbotSettings = z.infer<typeof chatbotSettingsSchema>;

export const updateChatbotValidator = z.object({
  id: z.string(),
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters.")
    .optional(),
  settings: chatbotSettingsSchema.optional(),
});
export type UpdateChatbotDto = z.infer<typeof updateChatbotValidator>;

export const createQuickPromptValidator = z.object({
  chatbotId: z.string(),
  title: z.string().max(80),
  prompt: z.string().max(500),
  isFollowUpPrompt: z.boolean().optional(),
});

export type CreateQuickPromptDto = z.infer<typeof createQuickPromptValidator>;

export const updateQuickPromptValidator = z.object({
  id: z.string(),
  title: z.string().optional(),
  prompt: z.string().optional(),
  isFollowUpPrompt: z.boolean().optional(),
});
export type UpdateQuickPromptDto = z.infer<typeof updateQuickPromptValidator>;

export const chatbotUserLogInValidator = z.object({
  chatbotId: z.string(),
  email: z.string().email(),
  name: z.string().max(80).optional(),
});

export const chatbotUserUpdateValidator = z.object({
  userId: z.string(),
  email: z.string().email().optional(),
  name: z.string().max(80).optional(),
});

export const sendHelpRequestSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
});

export const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(500),
});
