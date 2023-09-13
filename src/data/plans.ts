import { Plan } from "@/types/plan";

export const plans: Record<string, Plan> = {
  free: {
    name: "Free",
    limits: {
      chatbots: 0,
      messagesPerMonth: 0,
      documents: 0,
      links: 0,
      teamMembers: 1,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      prioritySupport: false,
    },
  },
  starter: {
    name: "Starter",
    limits: {
      chatbots: 1,
      links: 40,
      documents: 20,
      messagesPerMonth: 3_000,
      teamMembers: 2,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      prioritySupport: false,
    },
  },
  team: {
    name: "Team",
    limits: {
      chatbots: 2,
      links: 120,
      documents: 100,
      messagesPerMonth: 10_000,
      teamMembers: 6,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      prioritySupport: false,
    },
  },
  business: {
    name: "Business",
    limits: {
      chatbots: 6,
      links: 600,
      documents: 300,
      messagesPerMonth: 40_000,
      teamMembers: "unlimited",
      apiAccess: true,
      removeWatermark: true,
      advancedCustomization: true,
      prioritySupport: true,
    },
  },
  enterprise: {
    name: "Enterprise",
    limits: {
      chatbots: "unlimited",
      links: "unlimited",
      documents: "unlimited",
      messagesPerMonth: "unlimited",
      teamMembers: "unlimited",
      apiAccess: true,
      removeWatermark: true,
      advancedCustomization: true,
      prioritySupport: true,
    },
  },
};
