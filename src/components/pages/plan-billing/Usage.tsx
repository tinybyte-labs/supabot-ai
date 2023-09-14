import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import StatCard from "@/components/StatCard";
import { useOrganization } from "@/hooks/useOrganization";
import { trpc } from "@/utils/trpc";
import { Users, Bot, Link2, Infinity, FileText } from "lucide-react";

const Usage = () => {
  const { plan } = useOrganization();
  const usage = trpc.subscription.usage.useQuery();
  if (usage.isLoading) {
    return <p>Loading...</p>;
  }
  if (usage.isError) {
    return <p>{usage.error.message}</p>;
  }
  return (
    <section className="space-y-8" id="usage">
      <SecondaryPageHeader title="Your current limits and usage" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <StatCard
          title="Total Team Members"
          icon={<Users size={20} />}
          value={
            <>
              {usage.data.teamMembers.toLocaleString()} /{" "}
              {plan?.limits.teamMembers === "unlimited" ? (
                <Infinity className="inline" size={32} />
              ) : (
                <>{plan?.limits.teamMembers.toLocaleString() || 0}</>
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
              {plan?.limits.chatbots === "unlimited" ? (
                <Infinity className="inline" size={32} />
              ) : (
                <>{plan?.limits.chatbots.toLocaleString() || 0}</>
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
              {plan?.limits.messagesPerMonth === "unlimited" ? (
                <Infinity className="inline" size={32} />
              ) : (
                <>{plan?.limits.messagesPerMonth.toLocaleString() || 0}</>
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
              {plan?.limits.links === "unlimited" ? (
                <Infinity className="inline" size={32} />
              ) : (
                <>{plan?.limits.links.toLocaleString() || 0}</>
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
              {plan?.limits.documents === "unlimited" ? (
                <Infinity className="inline" size={32} />
              ) : (
                <>{plan?.limits.documents.toLocaleString() || 0}</>
              )}
            </>
          }
        />
      </div>
    </section>
  );
};

export default Usage;
