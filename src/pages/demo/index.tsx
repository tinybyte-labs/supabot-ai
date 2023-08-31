import DemoChatbox from "@/components/DemoChatbox";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const DemoPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Demo - ${APP_NAME}`}</title>
      </Head>

      <main className="container py-16">
        <DemoChatbox />
      </main>
    </>
  );
};

DemoPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default DemoPage;
