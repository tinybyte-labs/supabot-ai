import { useChatbot } from "@/hooks/useChatbot";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ReactNode } from "react";
import ErrorBox from "./ErrorBox";
import { Button, ButtonLoader } from "./ui/button";
import Link from "next/link";
import { useOrganization } from "@/hooks/useOrganization";

const ChatbotGuard = ({ children }: { children: ReactNode }) => {
  const orgQuery = useOrganization();
  const chatbotQuery = useChatbot();

  if (chatbotQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorBox
          title="Failed to load Chatbot"
          description={chatbotQuery.error.message}
        >
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft size={18} className="-ml-1 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={chatbotQuery.isRefetching}
            onClick={() => chatbotQuery.refetch()}
          >
            {chatbotQuery.isRefetching ? (
              <ButtonLoader />
            ) : (
              <RefreshCw size={18} className="-ml-1 mr-2" />
            )}
            Retry
          </Button>
        </ErrorBox>
      </div>
    );
  }

  if (
    chatbotQuery.isSuccess &&
    orgQuery.isSuccess &&
    chatbotQuery.data.organizationId !== orgQuery.data.id
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorBox title="404" description="Chatbot not found!">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft size={18} className="-ml-1 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </ErrorBox>
      </div>
    );
  }

  return <>{children}</>;
};

export default ChatbotGuard;
