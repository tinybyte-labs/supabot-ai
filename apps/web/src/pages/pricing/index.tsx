import PricingFAQ from "@/components/pages/pricing/PricingFAQ";
import SubscriptionPlans from "@/components/pages/pricing/SubscriptionPlans";
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
      <SubscriptionPlans />
      <PricingFAQ />
    </>
  );
};

PricingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default PricingPage;