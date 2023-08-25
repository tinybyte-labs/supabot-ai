import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Settings" />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
