import { APP_NAME } from "@/utils/constants";
import { Bot, LineChart, Palette } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as Tabs from "@radix-ui/react-tabs";

const features = [
  {
    id: "intuitive-analytics",
    title: "Intuitive Analytics",
    icon: <LineChart size={24} />,
    screenshotUrl: "/assets/intuitive-analytics.png",
    darkScreenshotUrl: "/assets/intuitive-analytics-dark.png",
  },
  {
    id: "train-ai",
    title: "Train AI",
    icon: <Bot size={24} />,
    screenshotUrl: "/assets/train-ai.png",
    darkScreenshotUrl: "/assets/train-ai-dark.png",
  },
  {
    id: "customize-the-look",
    title: "Customize the Look",
    icon: <Palette size={24} />,
    screenshotUrl: "/assets/customize-the-look.png",
    darkScreenshotUrl: "/assets/customize-the-look-dark.png",
  },
];

const Features = () => {
  const [feature, setFeature] = useState(features[0].id);
  return (
    <section className="my-24 md:my-48">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Powerful AI ChatBot for the modern Web
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            {APP_NAME} is not just any ChatBot. It is powered by OpenAI’s
            ChatGPT LLM plus it is trained on your own website content to give
            your customers the best personalized experience.
          </p>
        </div>

        <div className="mt-16">
          <Tabs.Root value={feature} onValueChange={setFeature}>
            <Tabs.List asChild>
              <div className="mb-8 grid gap-4 md:grid-cols-3 md:gap-8">
                {features.map((item) => (
                  <Tabs.Trigger asChild key={item.id} value={item.id}>
                    <button
                      className={cn(
                        "flex h-16 items-center gap-4 rounded-xl border px-6 text-left font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
                        {
                          "border-foreground/20 text-accent-foreground":
                            item.id === feature,
                        },
                      )}
                    >
                      {item.icon}
                      <div className="flex-1 truncate">{item.title}</div>
                    </button>
                  </Tabs.Trigger>
                ))}
              </div>
            </Tabs.List>
            {features.map((feature) => (
              <Tabs.Content value={feature.id} key={feature.id} asChild>
                <div className="relative">
                  <Image
                    src={feature.screenshotUrl}
                    width={2880}
                    height={1800}
                    alt="Customize the Look"
                    className="overflow-hidden rounded-lg border dark:hidden md:rounded-2xl"
                  />
                  <Image
                    src={feature.darkScreenshotUrl}
                    width={2880}
                    height={1800}
                    alt="Customize the Look"
                    className="hidden overflow-hidden rounded-lg border dark:block md:rounded-2xl"
                  />
                  <div className="absolute inset-0 -z-10 bg-foreground/5 blur-3xl"></div>
                </div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </div>
    </section>
  );
};

export default Features;
