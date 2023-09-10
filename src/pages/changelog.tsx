import DashboardPageHeader from "@/components/DashboardPageHeader";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const ChangelogPage: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>{`Changelog - ${APP_NAME}`}</title>
      </Head>
      <main>
        <DashboardPageHeader title="Changelog" subtitle="Comming soon" />
      </main>
    </div>
  );
};

ChangelogPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default ChangelogPage;
