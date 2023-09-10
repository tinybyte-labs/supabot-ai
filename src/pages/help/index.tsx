import DashboardPageHeader from "@/components/DashboardPageHeader";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const HelpPage: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>{`Help - ${APP_NAME}`}</title>
      </Head>
      <main>
        <DashboardPageHeader title="Help" subtitle="Comming soon" />
      </main>
    </div>
  );
};

HelpPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default HelpPage;
