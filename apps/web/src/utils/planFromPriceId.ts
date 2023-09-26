import { plans } from "@/data/plans";

export const planFromPriceId = (priceId: string) =>
  plans.find(
    (plan) =>
      plan.price.monthly.priceId === priceId ||
      plan.price.yearly.priceId === priceId,
  );
