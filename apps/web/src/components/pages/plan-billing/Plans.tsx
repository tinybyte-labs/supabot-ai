import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { usePlan } from "@/hooks/usePlan";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  PlanInterval,
  businessPlan,
  getFeaturesForPlan,
  proPlans,
} from "@acme/plans";
import { useStripe } from "@stripe/react-stripe-js";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

const Plans = () => {
  const plan = usePlan();

  return (
    <section className="space-y-8" id="plans">
      <SecondaryPageHeader
        title="Plans"
        subtitle={`You are currently on the ${plan.name} plan.`}
      />
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-6">
          <PlansGrid interval="monthly" />
        </TabsContent>
        <TabsContent value="yearly" className="mt-6">
          <PlansGrid interval="yearly" />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Plans;

export const PlansGrid = ({ interval }: { interval: PlanInterval }) => {
  const { data: currentOrg } = useOrganization();
  const currentPlan = usePlan();
  const [loadingPriceId, setLoadingLoadingPriceId] = useState<string | null>(
    null,
  );
  const stripe = useStripe();
  const { toast } = useToast();

  const getCustomerPortal = trpc.stripe.getCheckoutSession.useMutation({
    onMutate: (vars) => {
      setLoadingLoadingPriceId(vars.priceId);
    },
    onSuccess: async (data) => {
      if (!stripe) {
        toast({
          title: "Error",
          description: "Stripe not initialized!",
          variant: "destructive",
        });
        return;
      }
      const { error } = await stripe?.redirectToCheckout({
        sessionId: data.id,
      });
      toast({
        title: "Error",
        description: error.message || "Something went wrong!",
        variant: "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong!",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoadingLoadingPriceId(null);
    },
  });

  const handleUpgrade = async (priceId: string) =>
    currentOrg
      ? getCustomerPortal.mutate({ priceId, orgSlug: currentOrg.slug })
      : {};

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      {proPlans.map((plan) => {
        const popular = plan.id === businessPlan.id;
        const active = plan.id === currentPlan.id;
        const price = plan.price[interval];
        return (
          <Card
            className={cn("flex flex-col", {
              "border-foreground": popular,
            })}
            key={plan.id}
          >
            <div className="flex-1 p-6">
              <div className="flex items-center">
                <p className="flex-1 truncate text-xl font-semibold">
                  {plan.name}
                </p>
                <p className="text-2xl font-bold">${price.amount}</p>
              </div>
              <ul className="mt-6 space-y-2">
                {getFeaturesForPlan(plan.id).map((item) => (
                  <li key={item.text}>
                    <Check className="mr-2 inline-block" size={20} />
                    <span className="text-sm leading-5">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Button
                className="w-full"
                variant={popular ? "default" : "secondary"}
                disabled={active || !!loadingPriceId}
                onClick={() => handleUpgrade(price.priceId)}
              >
                {loadingPriceId === price.priceId ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : active ? (
                  "Current Plan"
                ) : (
                  "Change Plan"
                )}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
