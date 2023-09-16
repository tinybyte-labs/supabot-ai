import ChatbotWidgetLayout from "@/layouts/ChatbotWidgetLayout";
import { NextPageWithLayout } from "@/types/next";

const ConversationsPage: NextPageWithLayout = () => {
  return <div>ConversationsPage</div>;
};

ConversationsPage.getLayout = (page) => (
  <ChatbotWidgetLayout>{page}</ChatbotWidgetLayout>
);

export default ConversationsPage;
