import PageHeader from "@/components/PageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const QuickPromptsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Quick Prompts" />
    </>
  );
};

QuickPromptsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default QuickPromptsPage;
