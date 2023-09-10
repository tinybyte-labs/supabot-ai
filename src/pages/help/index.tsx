import PageHeader from "@/components/PageHeader";
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
        <PageHeader title="Help" subtitle="Comming soon" />
      </main>
    </div>
  );
};

HelpPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default HelpPage;
