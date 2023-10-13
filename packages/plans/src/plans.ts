import { Plan } from "./types";

export const freePlan: Plan = {
  id: "free",
  name: "Free",
  limits: {
    chatbots: 0,
    links: 0,
    documents: 0,
    messagesPerMonth: 0,
    teamMembers: 1,
    apiAccess: false,
    removeWatermark: false,
    advancedCustomization: false,
    prioritySupport: false,
  },
  price: {
    monthly: {
      amount: 0,
      priceId: "",
    },
    yearly: {
      amount: 0,
      priceId: "",
    },
  },
};

export const starterPlan: Plan = {
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
      priceId: "price_1Nq8NiIQCdsqhd30uKLcDGCE",
    },
    yearly: {
      amount: 90,
      priceId: "price_1Nq8NiIQCdsqhd30ntDovn8j",
    },
  },
};

export const teamPlan: Plan = {
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
      priceId: "price_1Nq8QgIQCdsqhd30pyd0HPc5",
    },
    yearly: {
      amount: 290,
      priceId: "price_1Nq8QgIQCdsqhd30Y3zKMKTN",
    },
  },
};

export const businessPlan: Plan = {
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
      priceId: "price_1Nq8RBIQCdsqhd303LuTZ1C1",
    },
    yearly: {
      amount: 990,
      priceId: "price_1Nq8RBIQCdsqhd30P21c7TN4",
    },
  },
};

export const enterprisePlan: Plan = {
  id: "enterprise",
  name: "Enterprise",
  limits: {
    chatbots: "unlimited",
    links: 15_000,
    documents: 8_000,
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
      priceId: "price_1Nq8RmIQCdsqhd30RKegxT1k",
    },
    yearly: {
      amount: 6990,
      priceId: "price_1Nq8RmIQCdsqhd30aPmCKKFx",
    },
  },
};

export const allPlans: Plan[] = [
  freePlan,
  starterPlan,
  teamPlan,
  businessPlan,
  enterprisePlan,
];

export const proPlans: Plan[] = [
  starterPlan,
  teamPlan,
  businessPlan,
  enterprisePlan,
];
