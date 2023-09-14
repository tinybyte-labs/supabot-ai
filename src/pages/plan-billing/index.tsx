import DashboardPageHeader from "@/components/DashboardPageHeader";
import CurrentPlan from "@/components/pages/plan-billing/CurrentPlan";
import Plans from "@/components/pages/plan-billing/Plans";
import Usage from "@/components/pages/plan-billing/Usage";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { Loader2 } from "lucide-react";
import Head from "next/head";

const Page: NextPageWithLayout = () => {
  const plan = trpc.subscription.plan.useQuery();

  if (plan.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (plan.isError) {
    return <p>{plan.error.message}</p>;
  }

  return (
    <>
      <Head>
        <title>{`Plan & Billing - ${APP_NAME}`}</title>
      </Head>

      <DashboardPageHeader title="Plan & Billing">
        <Badge>{plan.data.name}</Badge>
      </DashboardPageHeader>
      <div className="container mb-32 mt-8 space-y-16 md:mt-16">
        <CurrentPlan plan={plan.data} />
        <Usage plan={plan.data} />
        <Plans plan={plan.data} />
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
