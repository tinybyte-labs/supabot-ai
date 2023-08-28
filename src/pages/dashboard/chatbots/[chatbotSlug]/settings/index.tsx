import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const ChatbotSettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Settings" />
    </>
  );
};

ChatbotSettingsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotSettingsPage;
