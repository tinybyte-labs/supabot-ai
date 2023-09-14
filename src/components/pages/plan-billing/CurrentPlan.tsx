import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { Button, ButtonLoader } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { trpc } from "@/utils/trpc";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CurrentPlan = () => {
  const { plan } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const getCustomerPortal = trpc.stripe.getCustomerPortal.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data.url) {
        router.push(data.url);
      } else {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });
  const handleVisitCustomerPortal = () => getCustomerPortal.mutate();
  return (
    <section className="space-y-6" id="current-plan">
      <SecondaryPageHeader
        title="Current Plan"
        subtitle={`You are currently on the ${plan?.name || "Free"} plan.`}
      />
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href={`/plan-billing#plans`}>
            View plans and upgrade
            <ArrowRight size={20} className="-mr-1 ml-2" />
          </Link>
        </Button>
        <Button
          variant="secondary"
          onClick={handleVisitCustomerPortal}
          disabled={isLoading}
        >
          {isLoading && <ButtonLoader />}
          Customer Portal
          <ArrowRight size={20} className="-mr-1 ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default CurrentPlan;
