import Demo from "@/components/pages/home/Demo";
import EndCTA from "@/components/pages/home/EndCTA";
import Features from "@/components/pages/home/Features";
import Hero from "@/components/pages/home/Hero";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const HomePage: NextPageWithLayout = () => {
  const pageTitle = `${APP_NAME} - Elevate Your Website with a Powerful Chatbot`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Transform your web experience with ${APP_NAME}, the future of conversational AI. Craft a personalized chatbot tailored to your website's content. Enhance customer engagement and boost conversions.`}
        />
      </Head>
      <Hero />
      <Demo />
      <Features />
      <EndCTA />
    </>
  );
};

HomePage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default HomePage;
