import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Plan & Billing" />
      <div className="container mb-32 mt-16"></div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
