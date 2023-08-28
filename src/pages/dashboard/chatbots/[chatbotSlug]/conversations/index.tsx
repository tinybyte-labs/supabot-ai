import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const ConversationsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Conversations" />
    </>
  );
};

ConversationsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ConversationsPage;
