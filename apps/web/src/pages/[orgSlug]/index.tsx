import DashboardPageHeader from "@/components/DashboardPageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorBox from "@/components/ErrorBox";
import { Chatbot } from "@acme/db";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/components/modals/useModal";
import CreateChatbotModal from "@/components/modals/CreateChatbotModal";

const ChatbotsGrid = ({ chatbots }: { chatbots: Chatbot[] }) => {
  const router = useRouter();
  const { orgSlug } = router.query as { orgSlug: string };
  if (!chatbots.length) {
    return (
      <div className="mx-auto max-w-screen-sm text-center">
        <p className="mt-6 text-lg font-semibold">Your Chatbot List is Empty</p>
        <p className="text-muted-foreground mt-1 text-sm">
          It looks like you&apos;re starting with a clean slate. Ready to craft
          your very first chatbot? Click the button below to embark on your
          chatbot creation journey! 🚀
        </p>
        <Button asChild className="mt-6">
          <Link href={`/${orgSlug}/chatbots/new`}>
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
          href={`/${orgSlug}/chatbots/${chatbot.id}`}
          className="bg-card text-card-foreground hover:border-foreground/20 flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-lg"
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
          <p className="text-muted-foreground text-sm">
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
  const router = useRouter();
  const orgSlug = router.query.orgSlug as string;
  const chatbotsQuery = trpc.chatbot.list.useQuery(
    { orgSlug },
    { enabled: router.isReady },
  );
  const [Modal, { openModal }] = useModal(CreateChatbotModal);

  return (
    <>
      <Modal />
      <DashboardPageHeader title="Chatbots">
        <Button onClick={() => openModal()}>
          <Plus size={20} className="-ml-1 mr-2" />
          Create Chatbot
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
