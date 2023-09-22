import * as z from "zod";

export const createChatbotValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters."),
});
export const chatbotSettingsSchema = z.object({
  messageBoxText: z.string().max(100).optional(),
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

export const createQuickPromptValidator = z.object({
  chatbotId: z.string(),
  title: z.string().max(80),
  prompt: z.string().max(500),
  isFollowUpPrompt: z.boolean().optional(),
});

export const updateQuickPromptValidator = z.object({
  id: z.string(),
  title: z.string().optional(),
  prompt: z.string().optional(),
  isFollowUpPrompt: z.boolean().optional(),
});

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
