import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import StatCard from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks/useOrganization";
import { usePlan } from "@/hooks/usePlan";
import { api } from "@/trpc/client";
import {
  UsersIcon,
  BotIcon,
  Link2Icon,
  InfinityIcon,
  FileTextIcon,
} from "lucide-react";

const Usage = () => {
  const { data: currentOrg, isSuccess: isOrgLoaded } = useOrganization();
  const plan = usePlan();
  const usageQuery = api.organization.usage.useQuery(
    { orgSlug: currentOrg?.slug || "" },
    { enabled: isOrgLoaded },
  );

  return (
    <section className="space-y-8" id="usage">
      <SecondaryPageHeader title="Your current limits and usage" />
      {usageQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {new Array(5).fill(1).map((_, i) => (
            <Skeleton className="h-[110px]" key={i} />
          ))}
        </div>
      ) : usageQuery.isError ? (
        <p>Error: {usageQuery.error.message}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Total Team Members"
            icon={<UsersIcon size={20} />}
            value={
              <>
                <span>{`${usageQuery.data.teamMembers.toLocaleString()} / `}</span>
                <span>
                  {plan.limits.teamMembers === "unlimited" ? (
                    <InfinityIcon className="inline" size={32} />
                  ) : (
                    plan.limits.teamMembers.toLocaleString()
                  )}
                </span>
              </>
            }
          />
          <StatCard
            title="Total Chatbots"
            icon={<BotIcon size={20} />}
            value={
              <>
                <span>{`${usageQuery.data.chatbots.toLocaleString()} / `}</span>
                <span>
                  {plan.limits.chatbots === "unlimited" ? (
                    <InfinityIcon className="inline" size={32} />
                  ) : (
                    plan.limits.chatbots.toLocaleString()
                  )}
                </span>
              </>
            }
          />
          <StatCard
            title="Total Messages Per Month"
            icon={<BotIcon size={20} />}
            value={
              <>
                <span>{`${usageQuery.data.messagesPerMonth.toLocaleString()} / `}</span>
                <span>
                  {plan.limits.messagesPerMonth === "unlimited" ? (
                    <InfinityIcon className="inline" size={32} />
                  ) : (
                    plan.limits.messagesPerMonth.toLocaleString()
                  )}
                </span>
              </>
            }
          />
          <StatCard
            title="Total Links"
            icon={<Link2Icon size={20} />}
            value={
              <>
                <span>{`${usageQuery.data.links.toLocaleString()} / `}</span>
                <span>
                  {plan.limits.links === "unlimited" ? (
                    <InfinityIcon className="inline" size={32} />
                  ) : (
                    plan.limits.links.toLocaleString()
                  )}
                </span>
              </>
            }
          />
          <StatCard
            title="Total Documents"
            icon={<FileTextIcon size={20} />}
            value={
              <>
                <span>{`${usageQuery.data.documents.toLocaleString()} / `}</span>
                <span>
                  {plan.limits.documents === "unlimited" ? (
                    <InfinityIcon className="inline" size={32} />
                  ) : (
                    plan.limits.documents.toLocaleString()
                  )}
                </span>
              </>
            }
          />
        </div>
      )}
    </section>
  );
};

export default Usage;
