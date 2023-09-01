import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Settings - ${APP_NAME}`}</title>
      </Head>

      <PageHeader title="Settings" />
      <div className="container mb-32 mt-16"></div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
