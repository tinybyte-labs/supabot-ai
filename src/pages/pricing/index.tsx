import PricingPlans from "@/components/PricingPlans";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const PricingPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Pricing - ${APP_NAME}`}</title>
      </Head>

      <main className="my-16 space-y-16">
        <PricingPlans />
      </main>
    </>
  );
};

PricingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default PricingPage;
