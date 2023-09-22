import { chatbotNameAtom } from "@/atoms/chatbotNameAtom";
import ChatboxPreviewer from "@/components/ChatboxPreviewer";
import CreateChatbotForm from "@/components/froms/CreateChatbotForm";
import { defaultChatbotSettings } from "@/data/defaultChatbotSettings";
import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { useAtomValue } from "jotai";
import Head from "next/head";

const NewChatbotPage: NextPageWithLayout = () => {
  const name = useAtomValue(chatbotNameAtom);

  return (
    <>
      <Head>
        <title>{`Let's Create a Chatbot - ${APP_NAME}`}</title>
      </Head>

      <main className="container flex items-start gap-16 py-8">
        <div className="flex-1">
          <div className="mx-auto max-w-md py-8">
            <h2 className="mb-6 text-2xl font-bold">
              Let&apos;s create a Chatbot
            </h2>
            <CreateChatbotForm />
          </div>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-secondary p-16 max-lg:hidden">
          <ChatboxPreviewer
            title={name}
            settings={{
              ...defaultChatbotSettings,
              welcomeMessage: "Hello! How can I help you today?",
            }}
          />
        </div>
      </main>
    </>
  );
};

NewChatbotPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default NewChatbotPage;
