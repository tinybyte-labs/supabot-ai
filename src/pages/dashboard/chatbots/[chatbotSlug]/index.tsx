import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ArrowRight, FileText, LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";

const ChatbotOverviewPage: NextPageWithLayout = () => {
  const { isLoaded, chatbot } = useChatbot();
  const statusQuery = trpc.chatbot.stats.useQuery(chatbot?.id || "", {
    enabled: isLoaded,
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
      <PageHeader title="Overview" />
      <div className="container mb-32 mt-16">
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
                href={`/dashboard/chatbots/${chatbot?.slug}/links`}
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
                href={`/dashboard/chatbots/${chatbot?.slug}/quick-prompts`}
                className="mt-2 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-accent-foreground hover:underline"
              >
                All Quick Prompts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

ChatbotOverviewPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotOverviewPage;
