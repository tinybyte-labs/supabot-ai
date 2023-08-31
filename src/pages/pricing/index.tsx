import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const PricingPage: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>{`Pricing - ${APP_NAME}`}</title>
      </Head>

      <p>Pricing Page</p>
    </div>
  );
};

PricingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default PricingPage;
