import { freePlan, plans } from "@/data/plans";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const useOrganization = () => {
  const router = useRouter();
  const orgSlug = router.query.orgSlug as string;
  const orgQuery = trpc.organization.getBySlug.useQuery(
    { slug: orgSlug },
    { enabled: router.isReady },
  );
  const plan = useMemo(
    () => plans.find((plan) => plan.id === orgQuery.data?.plan) || freePlan,
    [orgQuery.data?.plan],
  );
  return {
    isLoading: orgQuery.isLoading,
    error: orgQuery.error,
    organization: orgQuery.data,
    plan,
    priceId: orgQuery.data?.priceId,
  };
};
