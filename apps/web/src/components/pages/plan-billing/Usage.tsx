import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks/useOrganization";
import { usePlan } from "@/hooks/usePlan";
import { trpc } from "@/utils/trpc";
import { Users, Bot, Link2, Infinity, FileText } from "lucide-react";

const Usage = () => {
  const { data: currentOrg, isSuccess: isOrgLoaded } = useOrganization();
  const plan = usePlan();
  const usage = trpc.subscription.usage.useQuery(
    { orgSlug: currentOrg?.slug || "" },
    { enabled: isOrgLoaded },
  );

  return (
    <section className="space-y-8" id="usage">
      <SecondaryPageHeader title="Your current limits and usage" />
      {usage.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {new Array(5).fill(1).map((_, i) => (
            <Skeleton className="h-[110px]" key={i} />
          ))}
        </div>
      ) : usage.isError ? (
        <p>Error: {usage.error.message}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Total Team Members"
            icon={<Users size={20} />}
            value={
              <>
                {usage.data.teamMembers.toLocaleString()} /{" "}
                {plan.limits.teamMembers === "unlimited" ? (
                  <Infinity className="inline" size={32} />
                ) : (
                  <>{plan.limits.teamMembers.toLocaleString()}</>
                )}
              </>
            }
          />
          <StatCard
            title="Total Chatbots"
            icon={<Bot size={20} />}
            value={
              <>
                {usage.data.chatbots.toLocaleString()} /{" "}
                {plan.limits.chatbots === "unlimited" ? (
                  <Infinity className="inline" size={32} />
                ) : (
                  <>{plan.limits.chatbots.toLocaleString()}</>
                )}
              </>
            }
          />
          <StatCard
            title="Total Messages Per Month"
            icon={<Bot size={20} />}
            value={
              <>
                {usage.data.messagesPerMonth.toLocaleString()} /{" "}
                {plan.limits.messagesPerMonth === "unlimited" ? (
                  <Infinity className="inline" size={32} />
                ) : (
                  <>{plan.limits.messagesPerMonth.toLocaleString()}</>
                )}
              </>
            }
          />
          <StatCard
            title="Total Links"
            icon={<Link2 size={20} />}
            value={
              <>
                {usage.data.links.toLocaleString()} /{" "}
                {plan.limits.links === "unlimited" ? (
                  <Infinity className="inline" size={32} />
                ) : (
                  <>{plan.limits.links.toLocaleString()}</>
                )}
              </>
            }
          />
          <StatCard
            title="Total Documents"
            icon={<FileText size={20} />}
            value={
              <>
                {usage.data.documents.toLocaleString()} /{" "}
                {plan.limits.documents === "unlimited" ? (
                  <Infinity className="inline" size={32} />
                ) : (
                  <>{plan.limits.documents.toLocaleString()}</>
                )}
              </>
            }
          />
        </div>
      )}
    </section>
  );
};

export default Usage;
