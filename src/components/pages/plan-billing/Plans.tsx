import PlansGrid from "@/components/PlansGrid";
import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { Switch } from "@/components/ui/switch";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { Plan } from "@/types/plan";
import { SubscriptionInterval } from "@/types/pricing-plan";
import { useMemo, useState } from "react";

const Plans = ({ plan }: { plan: Plan }) => {
  const [interval, setInterval] = useState<SubscriptionInterval>("monthly");
  const currentPlans = useMemo(
    () => subscriptionPlans.filter((plan) => plan.interval === interval),
    [interval],
  );

  return (
    <section className="space-y-8" id="plans">
      <SecondaryPageHeader
        title="Plans"
        subtitle={`You are currently on the ${plan.name} plan.`}
      />
      <div className="flex items-center justify-center gap-2">
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
        buttonLabel={(plan) => `Upgrade to ${plan.name}`}
        onPlanClick={(plan) => {
          console.log(plan);
          alert("Comming soon");
        }}
      />
    </section>
  );
};

export default Plans;
