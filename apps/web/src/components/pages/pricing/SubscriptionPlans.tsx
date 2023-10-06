import PlansGrid from "@/components/PlansGrid";
import { useRouter } from "next/router";

const SubscriptionPlans = () => {
  const router = useRouter();
  return (
    <section id="pricing" className="py-24">
      <div className="container space-y-8">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-center font-medium md:text-lg">
            Choose plan that works for you and your team.
          </p>
        </div>

        <PlansGrid onPlanClick={() => router.push("/signin")} />
      </div>
    </section>
  );
};

export default SubscriptionPlans;
