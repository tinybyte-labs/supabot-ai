import { plans } from "@acme/plans";

export const planFromPriceId = (priceId: string) => {
  return plans.find(
    (plan) =>
      plan.price.monthly.priceId === priceId ||
      plan.price.yearly.priceId === priceId,
  );
};
