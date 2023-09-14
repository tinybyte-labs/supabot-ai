import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, HelpCircle, Loader2 } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { PlanInterval } from "@/types/plan-interval";
import { Plan } from "@/types/plan";
import { plans } from "@/data/plans";

const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

const features = (planId: string) => {
  const plan = plans.find((plan) => plan.id === planId);
  if (!plan) return [];
  return [
    {
      text: `${
        plan.limits.chatbots === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.chatbots.toLocaleString()}`
      } chatbot${
        plan.limits.chatbots === "unlimited" || plan.limits.chatbots > 1
          ? "s"
          : ""
      }`,
    },
    {
      text: `${
        plan.limits.links === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.links.toLocaleString()}`
      } link${
        plan.limits.links === "unlimited" || plan.limits.links > 1 ? "s" : ""
      }`,
    },
    {
      text: `${
        plan.limits.documents === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.documents.toLocaleString()}`
      } document${
        plan.limits.documents === "unlimited" || plan.limits.documents > 1
          ? "s"
          : ""
      }`,
    },
    {
      text: `${
        plan.limits.messagesPerMonth === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.messagesPerMonth.toLocaleString()}`
      } AI messages/mo`,
    },
    {
      text: `${
        plan.limits.teamMembers === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.teamMembers.toLocaleString()}`
      } team members`,
    },
    {
      text: `${
        plan.limits.advancedCustomization ? "Advanced" : "Basic"
      } customization`,
    },
    ...(plan.limits.apiAccess
      ? [
          {
            text: `API Access`,
            explaination: `Under development. ETA: December 2023`,
          },
        ]
      : []),
    ...(plan.limits.prioritySupport
      ? [
          {
            text: `Priority support`,
            explaination: `Email & chat support within 24 hours.`,
          },
        ]
      : []),
  ];
};

const pricingItems: {
  id: string;
  name: string;
  description?: string;
  features: { text: string; explaination?: string }[];
}[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For startups & side projects",
    features: features("starter"),
  },
  {
    id: "team",
    name: "Team",
    description: "For small to medium teams",
    features: features("team"),
  },
  {
    id: "business",
    name: "Business",
    description: "For larger teams with increased usage",
    features: features("business"),
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For businesses with custom needs",
    features: features("enterprise"),
  },
];

const PlansGrid = ({
  currentPriceId,
  onPlanClick,
  buttonLabel,
  loading,
  initialInterval = "monthly",
}: {
  hidePopularBadge?: boolean;
  currentPriceId?: string | null;
  loading?: boolean;
  onPlanClick?: (priceId: string) => void;
  buttonLabel?: (plan: Plan) => string;
  initialInterval?: PlanInterval;
}) => {
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
      <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {pricingItems.map((item) => {
          const popular = item.id === "business";
          const plan = plans.find((plan) => plan.id === item.id)!;
          const price = plan?.price[interval].amount;
          const priceId = plan?.price[interval].priceId;
          const isCurrentPlan = priceId === currentPriceId;
          return (
            <div key={item.id} className="relative">
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
                <div className="flex flex-col items-center gap-3 border-b p-4 pt-8 text-center">
                  <h3 className="text-2xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-5xl font-semibold">
                    {(interval === "monthly" ? price : price / 12)
                      .toFixed(1)
                      .replace(rx, "$1")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per month, billed {interval}
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4">
                  {item.features.map((feature, i) => {
                    return (
                      <div key={i}>
                        <Check size={20} className="mr-4 inline text-primary" />
                        <p className="inline text-sm">
                          {feature.text}
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
                    disabled={isCurrentPlan || loading}
                    onClick={() => onPlanClick?.(plan.price[interval].priceId)}
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
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
  );
};

export default PlansGrid;
