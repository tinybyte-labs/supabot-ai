import DashboardPageHeader from "@/components/DashboardPageHeader";
import QuickInstallationCard from "@/components/QuickInstallationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  LinkIcon,
  Loader2,
  MessagesSquare,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const ChatbotOverviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const chatbotId = router.query.chatbotId as string;
  const statusQuery = trpc.chatbot.stats.useQuery(chatbotId, {
    enabled: router.isReady,
  });

  if (statusQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (statusQuery.isError) {
    return (
      <div>
        <p>{statusQuery.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <DashboardPageHeader title="Overview">
        <Button variant="outline" asChild>
          <Link href={`/demo/c/${chatbotId}`} target="_blank">
            Demo
            <ExternalLink size={18} className="-mr-1 ml-2" />
          </Link>
        </Button>
      </DashboardPageHeader>
      <div className="container space-y-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.linksCount.toLocaleString()}
              </div>
              <Link
                href={`/chatbots/${chatbotId}/links`}
                className="mt-2 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-accent-foreground hover:underline"
              >
                All Links
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quick Prompts
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.quickPromptCount.toLocaleString()}
              </div>
              <Link
                href={`/chatbots/${chatbotId}/quick-prompts`}
                className="mt-2 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-accent-foreground hover:underline"
              >
                All Quick Prompts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.userCount.toLocaleString()}
              </div>
              <Link
                href={`/chatbots/${chatbotId}/users`}
                className="mt-2 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-accent-foreground hover:underline"
              >
                All Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.conversationCount.toLocaleString()}
              </div>
              <Link
                href={`/chatbots/${chatbotId}/conversations`}
                className="mt-2 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-accent-foreground hover:underline"
              >
                All Conversations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.messageLikeCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Dislikes
              </CardTitle>
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statusQuery.data.messageDislikeCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        <QuickInstallationCard chatbotId={chatbotId} />
      </div>
    </>
  );
};

ChatbotOverviewPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotOverviewPage;
