import { SubscriptionPlan } from "@/types/pricing-plan";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    title: "Starter",
    interval: "monthly",
    price: 9,
    description: "For startups & side projects",
  },
  {
    id: "team",
    title: "Team",
    interval: "monthly",
    price: 29,
    description: "For startups & side projects",
  },
  {
    id: "business",
    title: "Business",
    interval: "monthly",
    price: 99,
    description: "For startups & side projects",
    isPopular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    interval: "monthly",
    price: 699,
    description: "For startups & side projects",
  },
  {
    id: "starter",
    title: "Starter",
    interval: "annually",
    price: 90,
    description: "For startups & side projects",
  },
  {
    id: "team",
    title: "Team",
    interval: "annually",
    price: 290,
    description: "For startups & side projects",
  },
  {
    id: "business",
    title: "Business",
    interval: "annually",
    price: 990,
    description: "For startups & side projects",
    isPopular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    interval: "annually",
    price: 6990,
    description: "For startups & side projects",
  },
];
