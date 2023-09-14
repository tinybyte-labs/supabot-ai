import PlansGrid from "@/components/PlansGrid";
import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { subscriptionPlans } from "@/data/subscriptionPlans";
import { Plan } from "@/types/plan";
import { SubscriptionInterval, SubscriptionPlan } from "@/types/pricing-plan";
import { trpc } from "@/utils/trpc";
import { useStripe } from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";

const Plans = ({ plan }: { plan: Plan }) => {
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState<SubscriptionInterval>("monthly");
  const currentPlans = useMemo(
    () => subscriptionPlans.filter((plan) => plan.interval === interval),
    [interval],
  );
  const stripe = useStripe();
  const { toast } = useToast();

  const getCustomerPortal = trpc.stripe.getCheckoutSession.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      if (!data) {
        setLoading(false);
        return;
      }
      stripe?.redirectToCheckout({ sessionId: data.id });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    },
  });
  const handleUpgrade = async (plan: SubscriptionPlan) =>
    getCustomerPortal.mutate({
      priceId: plan.priceId,
    });
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
        onPlanClick={handleUpgrade}
        loading={loading}
      />
    </section>
  );
};

export default Plans;
