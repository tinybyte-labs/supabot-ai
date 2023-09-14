import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import { Plan } from "@/types/plan";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CurrentPlan = ({ plan }: { plan: Plan }) => {
  return (
    <section className="space-y-6" id="current-plan">
      <SecondaryPageHeader
        title="Current Plan"
        subtitle={`You are currently on the ${plan.name} plan.`}
      />
      <div>
        <Link
          href={`/plan-billing#plans`}
          className="font-medium underline-offset-4 hover:underline"
        >
          View plans and upgrade
          <ArrowRight size={20} className="ml-2 inline-block" />
        </Link>
      </div>
    </section>
  );
};

export default CurrentPlan;
