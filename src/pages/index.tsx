import Background from "@/components/home/Background";
import Demo from "@/components/home/Demo";
import EndCTA from "@/components/home/EndCTA";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import Head from "next/head";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>SupaBot AI - Elevate Your Website with a Powerful Chatbot</title>
        <meta
          name="description"
          content="Transform your web experience with SupaBot AI, the future of conversational AI. Craft a personalized chatbot tailored to your website's content. Enhance customer engagement and boost conversions."
        />
      </Head>
      <Background />
      <Hero />
      <Demo />
      <Features />
      <EndCTA />
    </>
  );
};

HomePage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default HomePage;
