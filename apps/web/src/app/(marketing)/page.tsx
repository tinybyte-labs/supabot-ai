import Demo from "@/components/pages/home/Demo";
import EndCTA from "@/components/pages/home/EndCTA";
import Features from "@/components/pages/home/Features";
import Hero from "@/components/pages/home/Hero";
import { APP_NAME } from "@acme/trpc/src/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${APP_NAME} - Elevate Your Website with a Powerful Chatbot`,
  description: `Transform your web experience with ${APP_NAME}, the future of conversational AI. Craft a personalized chatbot tailored to your website's content. Enhance customer engagement and boost conversions.`,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Demo />
      <Features />
      <EndCTA />
    </>
  );
}
