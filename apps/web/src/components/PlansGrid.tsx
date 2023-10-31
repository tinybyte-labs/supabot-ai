import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, HelpCircleIcon, Loader2Icon } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { Plan, PlanInterval } from "@/types/plan";
import { businessPlan, getFeaturesForPlan, proPlans } from "@acme/plans";

const roundPricingRegex = /\.0+$|(\.[0-9]*[1-9])0+$/;

export type PlansGridProps = {
  hidePopularBadge?: boolean;
  currentPriceId?: string | null;
  loading?: boolean;
  onPlanClick?: (priceId: string) => void;
  buttonLabel?: (plan: Plan) => string;
  initialInterval?: PlanInterval;
};

const PlansGrid = ({
  currentPriceId,
  onPlanClick,
  buttonLabel,
  loading,
  initialInterval = "monthly",
}: PlansGridProps) => {
  const [interval, setInterval] = useState<PlanInterval>(initialInterval);

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-2">
        <p className="text-muted-foreground">Billed Monthly</p>
        <Switch
          checked={interval === "yearly"}
          onCheckedChange={(value) => setInterval(value ? "yearly" : "monthly")}
        />
        <p className="text-muted-foreground">Billed Annually</p>
      </div>
      <div className="relative z-10">
        <div className="absolute -left-10 -top-10 -z-10 h-[500px] w-[500px] rotate-45 rounded-[100px] bg-indigo-500/40 blur-[160px]"></div>
        <div className="absolute -right-0 top-10 -z-10 h-[500px] w-[500px] scale-x-125 rounded-[100px] bg-pink-500/40 blur-[180px]"></div>

        <div className="mt-16 grid grid-cols-1 rounded-2xl max-xl:gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {proPlans.map((plan) => {
            const popular = plan.id === businessPlan.id;
            const price = plan.price[interval];
            const isCurrentPlan = price.priceId === currentPriceId;
            const features = getFeaturesForPlan(plan.id);
            return (
              <div
                key={plan.id}
                className="bg-background/50 relative border-y border-white/20 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r max-xl:rounded-2xl max-xl:border"
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-full bg-indigo-500 px-4 text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="relative flex h-full flex-1 flex-col">
                  <div className="flex flex-col items-center gap-3 p-6 pt-12 text-center">
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                    <p className="text-6xl font-semibold">
                      $
                      {(interval === "monthly"
                        ? price.amount
                        : price.amount / 12
                      )
                        .toFixed(1)
                        .replace(roundPricingRegex, "$1")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      per month, billed {interval}
                    </p>
                  </div>
                  <div className="px-6">
                    <div className="h-px w-full bg-white/20"></div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    {features.map((feature, i) => {
                      return (
                        <div key={i}>
                          <CheckIcon
                            size={20}
                            className="text-primary mr-4 inline"
                          />
                          <p className="inline text-sm">
                            {feature.text}
                            {!!feature.explanation && (
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                  <HelpCircleIcon
                                    size={20}
                                    className="text-muted-foreground ml-2 inline"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {feature.explanation}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-6">
                    <Button
                      variant={popular ? "primary" : "default"}
                      className="flex w-full rounded-full"
                      size="lg"
                      disabled={isCurrentPlan || loading}
                      onClick={() => onPlanClick?.(price.priceId)}
                    >
                      {loading ? (
                        <Loader2Icon size={20} className="animate-spin" />
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : buttonLabel ? (
                        buttonLabel(plan)
                      ) : (
                        "Get Started"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlansGrid;
