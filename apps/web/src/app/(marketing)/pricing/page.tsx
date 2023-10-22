import PricingFAQ from "@/components/pages/pricing/PricingFAQ";
import SubscriptionPlans from "@/components/pages/pricing/SubscriptionPlans";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Pricing - ${APP_NAME}`,
};

export default function page() {
  return (
    <>
      <SubscriptionPlans />
      <PricingFAQ />
    </>
  );
}
