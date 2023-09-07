import ConversationsLayout from "@/layouts/ConversationsLayout";
import { NextPageWithLayout } from "@/types/next";
import { Loader2 } from "lucide-react";

const ConversationsPage: NextPageWithLayout = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
};

ConversationsPage.getLayout = (page) => (
  <ConversationsLayout>{page}</ConversationsLayout>
);

export default ConversationsPage;
