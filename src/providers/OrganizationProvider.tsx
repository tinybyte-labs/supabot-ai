import { trpc } from "@/utils/trpc";
import { useAuth } from "@clerk/nextjs";
import { Organization } from "@prisma/client";
import { ReactNode, createContext } from "react";

export type OrganizationContextType = {
  organization?: Organization | null;
  isLoading: boolean;
};

const OrganizationContext = createContext<OrganizationContextType | null>(null);

const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { orgSlug, isLoaded } = useAuth();
  const orgQuery = trpc.organization.getOrg.useQuery(
    { orgSlug: orgSlug || "" },
    { enabled: isLoaded && !!orgSlug },
  );
  return (
    <OrganizationContext.Provider
      value={{ isLoading: orgQuery.isLoading, organization: orgQuery.data }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationProvider;
