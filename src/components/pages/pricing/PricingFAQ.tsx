import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { APP_NAME } from "@/utils/constants";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const FAQS = [
  {
    question: "Is there a free plan?",
    answer: `SupaBot AI does not offer a free plan. However, you can explore the capabilities of our platform by interacting with our [demo chatbot](/home#demo).`,
  },
  {
    question: "What happens when I exceed the messages limit on my plan?",
    answer: `If you exceed your monthly messages limits, your customers will not be able send any other messages.`,
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: `Yes, you can cancel your subscription at any time. If you cancel your subscription, you will still be able to use ${APP_NAME} until the end of your billing period.`,
  },
  {
    question: "Are there any message limits associated with the pricing plans?",
    answer: `Yes, each pricing plan comes with its own set of limitations regarding the number of messages that can be sent. To view the specific limits for each plan, please refer to our [pricing plans](/pricing).`,
  },
];

const PricingFAQ = () => {
  return (
    <section id="pricing-faq" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Pricing FAQ
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Can&apos;t find the answer you are looking for? Reach out to our{" "}
            <Link
              href="mailto:support@supabotai.com"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              support team
            </Link>{" "}
            and we will get back to you ASAP.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-16 max-w-screen-md"
        >
          {FAQS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <ReactMarkdown className="prose prose-zinc dark:prose-invert">
                  {item.answer}
                </ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default PricingFAQ;
