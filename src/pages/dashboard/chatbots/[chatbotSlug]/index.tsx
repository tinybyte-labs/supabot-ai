import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const ChatbotOverviewPage: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader title="Overview" />
    </div>
  );
};

ChatbotOverviewPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotOverviewPage;
