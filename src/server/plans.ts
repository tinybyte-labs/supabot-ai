export type Plan = {
  limits: {
    chatbots: number | "unlimited";
    messagesPerMonth: number | "unlimited";
    webpages: number | "unlimited";
    documents: number | "unlimited";
    teamMembers: number | "unlimited";
    advancedCustomization: boolean;
    removeWatermark: boolean;
    apiAccess: boolean;
    priority_support: boolean;
  };
};

export const plans: Record<string, Plan> = {
  free: {
    limits: {
      chatbots: 0,
      messagesPerMonth: 0,
      documents: 0,
      webpages: 0,
      teamMembers: 0,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      priority_support: false,
    },
  },
  starter: {
    limits: {
      chatbots: 1,
      webpages: 40,
      documents: 20,
      messagesPerMonth: 3_000,
      teamMembers: 2,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      priority_support: false,
    },
  },
  team: {
    limits: {
      chatbots: 2,
      webpages: 120,
      documents: 100,
      messagesPerMonth: 10_000,
      teamMembers: 6,
      apiAccess: false,
      removeWatermark: false,
      advancedCustomization: false,
      priority_support: false,
    },
  },
  business: {
    limits: {
      chatbots: 6,
      webpages: 600,
      documents: 300,
      messagesPerMonth: 40_000,
      teamMembers: "unlimited",
      apiAccess: true,
      removeWatermark: true,
      advancedCustomization: true,
      priority_support: true,
    },
  },
  enterprise: {
    limits: {
      chatbots: "unlimited",
      webpages: "unlimited",
      documents: "unlimited",
      messagesPerMonth: "unlimited",
      teamMembers: "unlimited",
      apiAccess: true,
      removeWatermark: true,
      advancedCustomization: true,
      priority_support: true,
    },
  },
};
