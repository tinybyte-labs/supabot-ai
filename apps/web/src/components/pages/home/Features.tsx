"use client";

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
  },
  {
    id: "train-ai",
    title: "Train AI",
    icon: <Bot size={24} />,
    screenshotUrl: "/assets/train-ai.png",
  },
  {
    id: "customize-the-look",
    title: "Customize the Look",
    icon: <Palette size={24} />,
    screenshotUrl: "/assets/customize-the-look.png",
  },
];

const Features = () => {
  const [feature, setFeature] = useState(features[0].id);
  return (
    <section id="features" className="py-32">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold opacity-90 md:text-5xl">
            Powerful AI ChatBot for the modern Web
          </h2>
          <p className="mt-4 text-center font-medium opacity-70 md:text-lg">
            {APP_NAME} is not just any ChatBot. It is powered by OpenAI’s
            ChatGPT LLM plus it is trained on your own website content to give
            your customers the best personalized experience.
          </p>
        </div>

        <div className="z-10 mt-16">
          <Tabs.Root value={feature} onValueChange={setFeature}>
            <Tabs.List asChild>
              <div className="relative mb-8 grid gap-4 md:grid-cols-3 md:gap-8">
                {features.map((item) => (
                  <Tabs.Trigger asChild key={item.id} value={item.id}>
                    <button
                      className={cn(
                        "text-muted-foreground hover:text-accent-foreground flex h-16 items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-6 text-left font-medium transition-colors hover:border-white/30",
                        {
                          "text-accent-foreground border-white/30":
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
                  <div className="overflow-hidden rounded-xl border-4 border-white/10 ring-1 ring-white/30 md:rounded-3xl md:border-8">
                    <Image
                      src={feature.screenshotUrl}
                      width={1600}
                      height={900}
                      alt="Customize the Look"
                      className="bg-background w-full"
                    />
                  </div>
                  <div className="absolute -left-10 -top-10 -z-10 h-[500px] w-[500px] rotate-45 rounded-[100px] bg-indigo-500/30 blur-[120px]"></div>
                  <div className="absolute -right-0 bottom-10 -z-10 h-[500px] w-[500px] scale-x-125 rounded-[100px] bg-pink-500/30 blur-[140px]"></div>
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
