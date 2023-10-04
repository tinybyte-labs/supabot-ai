import PlansGrid from "@/components/PlansGrid";
import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { usePlan } from "@/hooks/usePlan";
import { trpc } from "@/utils/trpc";
import { useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const Plans = () => {
  const { data: currentOrg } = useOrganization();
  const plan = usePlan();
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
    getCustomerPortal.mutate({ priceId, orgSlug: currentOrg?.slug || "" });

  return (
    <section className="space-y-8" id="plans">
      <SecondaryPageHeader
        title="Plans"
        subtitle={`You are currently on the ${plan.name} plan.`}
      />
      <PlansGrid
        buttonLabel={() => `Change Plan`}
        onPlanClick={handleUpgrade}
        loading={loading}
        currentPriceId={currentOrg?.priceId}
      />
    </section>
  );
};

export default Plans;
