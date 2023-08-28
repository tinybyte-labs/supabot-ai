import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const ChatbotCustomizationPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Customization" />
    </>
  );
};

ChatbotCustomizationPage.getLayout = (page) => (
  <ChatbotLayout>{page}</ChatbotLayout>
);

export default ChatbotCustomizationPage;
