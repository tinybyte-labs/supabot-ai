import { chatbotNameAtom } from "@/atoms/chatbotNameAtom";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import CreateChatbotForm from "@/components/froms/CreateChatbotForm";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { UserButton } from "@clerk/nextjs";
import { useAtomValue } from "jotai";
import { ArrowLeft, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NewChatbotPage: NextPageWithLayout = () => {
  const name = useAtomValue(chatbotNameAtom);

  return (
    <>
      <header className="border-b bg-card text-card-foreground">
        <div className="container flex h-20 items-center gap-6">
          <Link href="/dashboard">
            <Image
              src="/logo.svg"
              width={504}
              height={407}
              alt={`${APP_NAME} Logo`}
              className="h-12 w-12 object-contain"
            />
          </Link>
          <OrganizationSwitcher />
          <div className="flex-1"></div>
          <UserButton />
        </div>
      </header>

      <main className="container flex items-start gap-16 py-16">
        <div className="w-96 max-lg:mx-auto">
          <h2 className="mb-6 text-2xl font-bold">
            Let&apos;s create a Chatbot
          </h2>
          <CreateChatbotForm />
        </div>
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-bl from-[#15B8FB] to-[#2563EB] py-16 max-lg:hidden">
          <div className="h-[620px] w-[400px] rounded-xl bg-background shadow-2xl">
            <header className="flex h-14 items-center gap-2 border-b px-2">
              <Button size="icon" variant="ghost">
                <ArrowLeft size={20} />
              </Button>
              <h1 className="flex-1 truncate text-lg font-bold">{name}</h1>
              <Button size="icon" variant="ghost">
                <MoreVertical size={20} />
              </Button>
            </header>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewChatbotPage;
