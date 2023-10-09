import { useMemo } from "react";
import { useOrganization } from "./useOrganization";
import { freePlan, allPlans } from "@acme/plans";

export const usePlan = () => {
  const orgQuery = useOrganization();

  return useMemo(
    () => allPlans.find((plan) => plan.id === orgQuery.data?.plan) || freePlan,
    [orgQuery.data?.plan],
  );
};
