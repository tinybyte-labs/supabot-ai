import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const DocsPage: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>{`Docs - ${APP_NAME}`}</title>
      </Head>
      DocsPage
    </div>
  );
};

DocsPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default DocsPage;
