import PageHeader from "@/components/PageHeader";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const ChangelogPage: NextPageWithLayout = () => {
  return (
    <main>
      <Head>
        <title>{`Changelog - ${APP_NAME}`}</title>
      </Head>
      <PageHeader title="Changelog" subtitle="Comming soon" />
    </main>
  );
};

ChangelogPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default ChangelogPage;
