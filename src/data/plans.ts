import { Plan } from "@/types/plan";

export const plans: Plan[] = [
  {
    id: "starter",
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
    price: {
      monthly: {
        amount: 9,
        priceId: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID || "",
      },
      yearly: {
        amount: 90,
        priceId: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICE_ID || "",
      },
    },
  },
  {
    id: "team",
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
    price: {
      monthly: {
        amount: 29,
        priceId: process.env.NEXT_PUBLIC_TEAM_MONTHLY_PRICE_ID || "",
      },
      yearly: {
        amount: 290,
        priceId: process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICE_ID || "",
      },
    },
  },
  {
    id: "business",
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
    price: {
      monthly: {
        amount: 99,
        priceId: process.env.NEXT_PUBLIC_BUSINESS_MONTHLY_PRICE_ID || "",
      },
      yearly: {
        amount: 990,
        priceId: process.env.NEXT_PUBLIC_BUSINESS_YEARLY_PRICE_ID || "",
      },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    limits: {
      chatbots: "unlimited",
      links: 10_000,
      documents: 5_000,
      messagesPerMonth: "unlimited",
      teamMembers: "unlimited",
      apiAccess: true,
      removeWatermark: true,
      advancedCustomization: true,
      prioritySupport: true,
    },
    price: {
      monthly: {
        amount: 699,
        priceId: process.env.NEXT_PUBLIC_ENTERPRISE_MONTHLY_PRICE_ID || "",
      },
      yearly: {
        amount: 6990,
        priceId: process.env.NEXT_PUBLIC_ENTERPRISE_YEARLY_PRICE_ID || "",
      },
    },
  },
];
