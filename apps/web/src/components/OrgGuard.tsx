import { useOrganization } from "@/hooks/useOrganization";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ErrorBox from "./ErrorBox";
import { Button, ButtonLoader } from "./ui/button";
import { ReactNode } from "react";
import Link from "next/link";

const OrgGuard = ({ children }: { children: ReactNode }) => {
  const orgQuery = useOrganization();

  if (orgQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorBox
          title="Failed to load Organization"
          description={orgQuery.error.message}
        >
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft size={18} className="-ml-1 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={orgQuery.isRefetching}
            onClick={() => orgQuery.refetch()}
          >
            {orgQuery.isRefetching ? (
              <ButtonLoader />
            ) : (
              <RefreshCw size={18} className="-ml-1 mr-2" />
            )}
            Retry
          </Button>
        </ErrorBox>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrgGuard;
