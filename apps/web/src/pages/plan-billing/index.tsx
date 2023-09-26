import DashboardPageHeader from "@/components/DashboardPageHeader";
import PlanBadge from "@/components/PlanBadge";
import CurrentPlan from "@/components/pages/plan-billing/CurrentPlan";
import Plans from "@/components/pages/plan-billing/Plans";
import Usage from "@/components/pages/plan-billing/Usage";
import { useOrganization } from "@/hooks/useOrganization";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { Loader2 } from "lucide-react";

const Page: NextPageWithLayout = () => {
  const { isLoading, error, plan } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <DashboardPageHeader title="Plan & Billing">
        <PlanBadge plan={plan} />
      </DashboardPageHeader>

      <div className="container space-y-16">
        <CurrentPlan />
        <Usage />
        <Plans />
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
