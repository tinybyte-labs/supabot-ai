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
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Choose plan that works for you and your team.
          </p>
        </div>

        <PlansGrid
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
