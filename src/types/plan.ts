import { PlanInterval } from "./plan-interval";

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
  price: Record<
    PlanInterval,
    {
      amount: number;
      priceId: string;
    }
  >;
};
