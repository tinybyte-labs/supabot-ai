import { plans } from "@/data/plans";
import { trpc } from "@/utils/trpc";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export const useOrganization = () => {
  const { orgSlug, isLoaded } = useAuth();
  const orgQuery = trpc.organization.getOrg.useQuery(
    { orgSlug: orgSlug || "" },
    { enabled: isLoaded && !!orgSlug },
  );
  const plan = useMemo(
    () => plans.find((plan) => plan.id === orgQuery.data?.plan),
    [orgQuery.data?.plan],
  );
  return {
    isLoading: orgQuery.isLoading,
    error: orgQuery.error,
    organizaton: orgQuery.data,
    plan,
  };
};
