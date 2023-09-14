export type Plan = {
  id: string;
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
    prioritySupport: boolean;
  };
  price: {
    monthly: {
      amount: number;
      priceId: string;
    };
    yearly: {
      amount: number;
      priceId: string;
    };
  };
};
