import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MarketingLayout from "@/layouts/MarketingLayout";
import { cn } from "@/lib/utils";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { Check, Minus, X } from "lucide-react";
import Head from "next/head";

const PricingPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Pricing - ${APP_NAME}`}</title>
      </Head>

      <main className="my-16 space-y-16">
        <div className="container">
          <h1 className="mx-auto max-w-screen-sm text-center text-6xl font-bold">
            Simple, affordable pricing
          </h1>
          <p className="mx-auto mt-4 max-w-screen-sm text-center text-xl text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, dolor?
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            <p className="text-muted-foreground">Billed Monthly</p>
            <Switch />
            <p className="text-muted-foreground">Billed Annually</p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {new Array(3).fill(1).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl border bg-card text-card-foreground shadow-2xl"
              >
                <div className="flex flex-col items-center gap-3 border-b p-6">
                  <h3 className="text-2xl font-semibold">Free</h3>
                  <p className="text-muted-foreground">
                    For startups & side projects
                  </p>
                  <p className="text-5xl font-semibold">$0</p>
                  <p className="text-muted-foreground">
                    per month, billed annually
                  </p>
                </div>
                <div className="flex flex-col gap-4 border-b p-6">
                  {new Array(10).fill(1).map((_, i) => {
                    const status =
                      i < 4 ? "checked" : i < 6 ? "indeterminate" : "unchecked";
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            {
                              "bg-green-500 text-white": status === "checked",
                              "bg-muted text-muted-foreground":
                                status !== "checked",
                            },
                          )}
                        >
                          {status === "checked" ? (
                            <Check size={20} />
                          ) : status === "indeterminate" ? (
                            <Minus size={20} />
                          ) : (
                            <X size={20} />
                          )}
                        </div>
                        <p
                          className={cn("", {
                            "text-muted-foreground": status !== "checked",
                          })}
                        >
                          Unlimited branded links
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6">
                  <Button className="flex w-full rounded-full" size="lg">
                    Get Started
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

PricingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default PricingPage;
