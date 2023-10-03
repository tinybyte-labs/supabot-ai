import DashboardPageHeader from "@/components/DashboardPageHeader";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";

const DocumentsPage: NextPageWithLayout = () => {
  return (
    <>
      <DashboardPageHeader title="Documents" />
    </>
  );
};

DocumentsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default DocumentsPage;
