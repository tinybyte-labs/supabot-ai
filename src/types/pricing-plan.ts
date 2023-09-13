export type SubscriptionInterval = "monthly" | "annually";

export type SubscriptionPlan = {
  id: string;
  price: number;
  interval: SubscriptionInterval;
  title: string;
  description: string;
  isPopular?: boolean;
};
