export type SubscriptionInterval = "monthly" | "annually";

export type SubscriptionPlan = {
  id: string;
  priceId: string;
  type: string;
  price: number;
  interval: SubscriptionInterval;
  name: string;
  description: string;
  isPopular?: boolean;
};
