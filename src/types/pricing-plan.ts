export type SubscriptionInterval = "monthly" | "annually";

export type SubscriptionPlan = {
  id: string;
  type: "starter" | "team" | "business" | "enterprise";
  price: number;
  interval: SubscriptionInterval;
  name: string;
  description: string;
  isPopular?: boolean;
};
