import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/data/features";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/pricing-plan";
import { Check, HelpCircle } from "lucide-react";

const PlansGrid = ({
  plans,
  hidePopularBadge,
  currentPlan,
  onPlanClick,
  buttonLabel,
}: {
  plans: SubscriptionPlan[];
  hidePopularBadge?: boolean;
  currentPlan?: string;
  onPlanClick?: (plan: SubscriptionPlan) => void;
  buttonLabel?: (plan: SubscriptionPlan) => string;
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-2 xl:grid-cols-4 xl:gap-4">
      {plans.map((plan) => {
        const popular = !hidePopularBadge && plan.isPopular;
        const isActive = plan.id === currentPlan;
        return (
          <div key={plan.id} className="relative">
            {popular && (
              <div className="absolute inset-0 -z-10 translate-y-10 bg-foreground/5 blur-3xl"></div>
            )}

            <div
              className={cn(
                "relative flex h-full flex-1 flex-col rounded-2xl border bg-card text-card-foreground",
                {
                  "border-primary": popular,
                },
              )}
            >
              {popular && (
                <div className="absolute left-1/2 top-0 flex h-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="flex flex-col items-center gap-3 border-b p-4 pt-8">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
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
                  if (!feature.items[plan.type]) {
                    return null;
                  }
                  return (
                    <div key={i}>
                      <Check size={20} className="mr-4 inline text-primary" />
                      <p className="inline text-sm">
                        {feature.items[plan.type]}
                        {!!feature.explaination && (
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger>
                              <HelpCircle
                                size={20}
                                className="ml-2 inline text-muted-foreground"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {feature.explaination}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t p-4">
                <Button
                  variant={popular ? "default" : "secondary"}
                  className="flex w-full rounded-full"
                  size="lg"
                  disabled={isActive}
                  onClick={() => onPlanClick?.(plan)}
                >
                  {isActive
                    ? "Current Plan"
                    : buttonLabel
                    ? buttonLabel(plan)
                    : "Get Started"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlansGrid;
