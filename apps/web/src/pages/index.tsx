import Demo from "@/components/pages/home/Demo";
import EndCTA from "@/components/pages/home/EndCTA";
import Features from "@/components/pages/home/Features";
import Hero from "@/components/pages/home/Hero";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { authOptions } from "@acme/auth";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  return {
    props: {
      session,
    },
  };
};
