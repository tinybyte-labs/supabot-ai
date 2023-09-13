import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/data/features";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { cn } from "@/lib/utils";
import { SubscriptionInterval, SubscriptionPlan } from "@/types/pricing-plan";
import { Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const SubscriptionPlans = () => {
  const [interval, setInterval] = useState<SubscriptionInterval>("annually");
  const curPlans = useMemo(
    () => subscriptionPlans.filter((plan) => plan.interval === interval),
    [interval],
  );
  return (
    <section id="pricing">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Choose plan that works for you and your team.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <p className="text-muted-foreground">Billed Monthly</p>
          <Switch
            checked={interval === "annually"}
            onCheckedChange={(value) =>
              setInterval(value ? "annually" : "monthly")
            }
          />
          <p className="text-muted-foreground">Billed Annually</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {curPlans.map((plan) => (
            <SubscriptionPlanCard
              plan={plan}
              key={`${plan.id}_${plan.interval}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;

const SubscriptionPlanCard = ({ plan }: { plan: SubscriptionPlan }) => {
  return (
    <div className="relative">
      {plan.isPopular && (
        <div className="absolute inset-0 -z-10 translate-y-10 bg-foreground/5 blur-3xl"></div>
      )}

      <div
        className={cn(
          "relative flex h-full flex-1 flex-col rounded-2xl border bg-card text-card-foreground",
          {
            "border-primary": plan.isPopular,
          },
        )}
      >
        {plan.isPopular && (
          <div className="absolute left-1/2 top-0 flex h-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
            Most Popular
          </div>
        )}
        <div className="flex flex-col items-center gap-3 border-b p-4 pt-8">
          <h3 className="text-2xl font-semibold">{plan.title}</h3>
          <p className="text-muted-foreground">{plan.description}</p>
          <p className="text-5xl font-semibold">
            $
            {(plan.interval === "monthly"
              ? plan.price
              : plan.price / 12
            ).toFixed(1)}
          </p>
          <p className="text-muted-foreground">
            per month, billed {plan.interval}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {features.map((feature, i) => {
            if (!feature.items[plan.id]) {
              return null;
            }
            return (
              <div key={i}>
                <Check size={20} className="mr-4 inline text-primary" />
                <p className="inline text-sm">
                  {feature.items[plan.id]}
                  {!!feature.explaination && (
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger>
                        <HelpCircle
                          size={20}
                          className="ml-2 inline text-muted-foreground"
                        />
                      </TooltipTrigger>
                      <TooltipContent>{feature.explaination}</TooltipContent>
                    </Tooltip>
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <div className="border-t p-4">
          <Button
            asChild
            variant={plan.isPopular ? "default" : "secondary"}
            className="flex w-full rounded-full"
            size="lg"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
