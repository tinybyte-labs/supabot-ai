export type Plan = {
  name: string;
  limits: {
    chatbots: number | "unlimited";
    messagesPerMonth: number | "unlimited";
    links: number | "unlimited";
    documents: number | "unlimited";
    teamMembers: number | "unlimited";
    advancedCustomization: boolean;
    removeWatermark: boolean;
    apiAccess: boolean;
    priority_support: boolean;
  };
};
