import PlansGrid from "@/components/PlansGrid";
import { Switch } from "@/components/ui/switch";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { SubscriptionInterval } from "@/types/pricing-plan";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const SubscriptionPlans = () => {
  const [interval, setInterval] = useState<SubscriptionInterval>("annually");
  const currentPlans = useMemo(
    () => subscriptionPlans.filter((plan) => plan.interval === interval),
    [interval],
  );
  const router = useRouter();
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Choose plan that works for you and your team.
          </p>
        </div>

        <div className="my-8 flex items-center justify-center gap-2">
          <p className="text-muted-foreground">Billed Monthly</p>
          <Switch
            checked={interval === "annually"}
            onCheckedChange={(value) =>
              setInterval(value ? "annually" : "monthly")
            }
          />
          <p className="text-muted-foreground">Billed Annually</p>
        </div>
        <PlansGrid
          plans={currentPlans}
          buttonLabel={(plan) => `Get started with ${plan.name}`}
          onPlanClick={() =>
            router.push({
              pathname: "/register",
              search: "redirect_url=/plan-billing#plans",
            })
          }
        />
      </div>
    </section>
  );
};

export default SubscriptionPlans;
