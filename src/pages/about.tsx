import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`About - ${APP_NAME}`}</title>
      </Head>
      <p>About Page</p>
    </>
  );
};

AboutPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default AboutPage;
