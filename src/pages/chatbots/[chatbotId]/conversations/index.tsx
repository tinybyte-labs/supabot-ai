import ConversationsLayout from "@/layouts/ConversationsLayout";
import { NextPageWithLayout } from "@/types/next";

const ConversationsPage: NextPageWithLayout = () => {
  return null;
};

ConversationsPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationsPage;
