import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const ChatbotUsersPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Users" />
    </>
  );
};

ChatbotUsersPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotUsersPage;
