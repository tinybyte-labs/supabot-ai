import { freePlan, plans } from "@/data/plans";
import { trpc } from "@/utils/trpc";
import { useOrganization as useClerkOrg } from "@clerk/nextjs";
import { useMemo } from "react";

export const useOrganization = () => {
  const { isLoaded, organization } = useClerkOrg();
  const orgQuery = trpc.organization.getOrg.useQuery(
    { orgSlug: organization?.slug || "" },
    { enabled: isLoaded && !!organization, retry: false },
  );
  const plan = useMemo(
    () => plans.find((plan) => plan.id === orgQuery.data?.plan) || freePlan,
    [orgQuery.data?.plan],
  );
  return {
    isLoading: orgQuery.isLoading,
    error: orgQuery.error,
    organization,
    plan,
    priceId: orgQuery.data?.priceId,
  };
};
