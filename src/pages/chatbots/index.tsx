import DashboardPageHeader from "@/components/DashboardPageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBox from "@/components/ErrorBox";
import { Chatbot } from "@prisma/client";

const ChatbotsGrid = ({ chatbots }: { chatbots: Chatbot[] }) => {
  if (!chatbots.length) {
    return (
      <div className="text-center">
        <p className="mt-6 text-lg font-semibold">
          You do not have any Chatbots
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Let&apos;s create a new chatbot by clicking on the button below.
        </p>
        <Button asChild className="mt-6">
          <Link href="/chatbots/new">
            <Plus size={20} className="-ml-1 mr-2" />
            New Chatbot
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {chatbots.map((chatbot) => (
        <Link
          key={chatbot.id}
          href={`/chatbots/${chatbot.id}`}
          className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:border-foreground/20 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              {chatbot.image && <AvatarImage src={chatbot.image} />}
              <AvatarFallback>
                <Image
                  src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.name}&size=128`}
                  width={128}
                  height={128}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{chatbot.name}</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated{" "}
            {formatDistanceToNow(new Date(chatbot.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </Link>
      ))}
    </div>
  );
};

const ChatbotsLoading = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {new Array(3).fill(1).map((_, i) => (
      <Skeleton className="h-[110px]" key={i} />
    ))}
  </div>
);

const ChatbotsPage: NextPageWithLayout = () => {
  const chatbotsQuery = trpc.chatbot.list.useQuery();
  return (
    <>
      <DashboardPageHeader title="Chatbots">
        <Button asChild>
          <Link href="/chatbots/new">
            <Plus size={20} className="-ml-1 mr-2" />
            Create Chatbot
          </Link>
        </Button>
      </DashboardPageHeader>

      <div className="container">
        {chatbotsQuery.isLoading ? (
          <ChatbotsLoading />
        ) : chatbotsQuery.isError ? (
          <ErrorBox
            description={chatbotsQuery.error.message}
            onRetry={() => chatbotsQuery.refetch()}
            title="Failed to load chatbtos"
            isRefetching={chatbotsQuery.isRefetching}
            className="col-span-full"
          />
        ) : (
          <ChatbotsGrid chatbots={chatbotsQuery.data} />
        )}
      </div>
    </>
  );
};

ChatbotsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ChatbotsPage;
