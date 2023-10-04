import { useMemo } from "react";
import { useOrganization } from "./useOrganization";
import { freePlan, plans } from "@/data/plans";

export const usePlan = () => {
  const orgQuery = useOrganization();

  return useMemo(
    () => plans.find((plan) => plan.id === orgQuery.data?.plan) || freePlan,
    [orgQuery.data?.plan],
  );
};
