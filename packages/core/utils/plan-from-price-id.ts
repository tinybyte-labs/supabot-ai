import { allPlans } from "@acme/plans";

export const planFromPriceId = (priceId: string) => {
  return allPlans.find(
    (plan) =>
      plan.price.monthly.priceId === priceId ||
      plan.price.yearly.priceId === priceId,
  );
};
