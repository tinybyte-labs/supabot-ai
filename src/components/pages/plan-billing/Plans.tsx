import PlansGrid from "@/components/PlansGrid";
import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { Plan } from "@/types/plan";
import { PlanInterval } from "@/types/plan-interval";
import { trpc } from "@/utils/trpc";
import { useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const Plans = () => {
  const { plan: currentPlan, organizaton } = useOrganization();
  const [loading, setLoading] = useState(false);
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
  const handleUpgrade = async (priceId: string) =>
    getCustomerPortal.mutate({ priceId });

  return (
    <section className="space-y-8" id="plans">
      <SecondaryPageHeader
        title="Plans"
        subtitle={`You are currently on the ${
          currentPlan?.name || "Free"
        } plan.`}
      />
      <PlansGrid
        buttonLabel={(plan) => `Upgrade to ${plan.name}`}
        onPlanClick={handleUpgrade}
        loading={loading}
        currentPriceId={organizaton?.priceId}
      />
    </section>
  );
};

export default Plans;
