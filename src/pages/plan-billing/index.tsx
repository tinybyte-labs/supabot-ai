import DashboardPageHeader from "@/components/DashboardPageHeader";
import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { Plan } from "@/types/plan";
import { APP_NAME } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { Bot, FileText, Link2, Users, Infinity } from "lucide-react";
import Head from "next/head";

const Page: NextPageWithLayout = () => {
  const plan = trpc.subscription.plan.useQuery();

  if (plan.isLoading) {
    return <p>Loading...</p>;
  }
  if (plan.isError) {
    return <p>{plan.error.message}</p>;
  }
  return (
    <>
      <Head>
        <title>{`Plan & Billing - ${APP_NAME}`}</title>
      </Head>

      <DashboardPageHeader title="Plan & Billing">
        <Badge>{plan.data.name}</Badge>
      </DashboardPageHeader>
      <div className="container mb-32 mt-8 md:mt-16">
        <Usage plan={plan.data} />
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

const Usage = ({ plan }: { plan: Plan }) => {
  const usage = trpc.subscription.usage.useQuery();
  if (usage.isLoading) {
    return <p>Loading...</p>;
  }
  if (usage.isError) {
    return <p>{usage.error.message}</p>;
  }
  return (
    <section className="space-y-6">
      <SecondaryPageHeader title="Your current limits and usage" />
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
    </section>
  );
};
