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
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";

const Page: NextPageWithLayout = (props) => {
  const {
    isLoading,
    isError,
    data: chatbots,
    error,
  } = trpc.chatbot.list.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

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
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
