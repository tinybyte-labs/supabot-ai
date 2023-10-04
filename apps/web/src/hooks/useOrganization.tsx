import { freePlan, plans } from "@/data/plans";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const useOrganization = () => {
  const router = useRouter();
  const orgSlug = router.query.orgSlug as string;
  return trpc.organization.getBySlug.useQuery(
    { slug: orgSlug },
    { enabled: router.isReady && !!orgSlug },
  );
};
