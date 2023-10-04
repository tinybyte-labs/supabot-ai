import DashboardPageHeader from "@/components/DashboardPageHeader";
import PlanBadge from "@/components/PlanBadge";
import CurrentPlan from "@/components/pages/plan-billing/CurrentPlan";
import Plans from "@/components/pages/plan-billing/Plans";
import Usage from "@/components/pages/plan-billing/Usage";
import { usePlan } from "@/hooks/usePlan";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";

const Page: NextPageWithLayout = () => {
  const plan = usePlan();

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
