import ChatbotSwitcher from "@/components/ChatbotSwitcher";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { ChatbotProvider } from "@/providers/ChatbotProvider";
import { APP_NAME } from "@/utils/constants";
import {
  LayoutGrid,
  Users,
  MessagesSquare,
  LinkIcon,
  FileText,
  Palette,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const ChatbotLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ChatbotProvider>
      <SideBar />
      <main className="ml-64">{children}</main>
    </ChatbotProvider>
  );
};

export default ChatbotLayout;

const SideBar = () => {
  const {
    query: { chatbotSlug },
  } = useRouter();
  const list: SideBarNavProps["list"] = [
    {
      items: [
        {
          href: `/dashboard/chatbots/${chatbotSlug}`,
          label: "Overview",
          icon: <LayoutGrid size={20} />,
          end: true,
        },
        {
          href: `/dashboard/chatbots/${chatbotSlug}/users`,
          label: "Users",
          icon: <Users size={20} />,
        },
        {
          href: `/dashboard/chatbots/${chatbotSlug}/conversations`,
          label: "Conversations",
          icon: <MessagesSquare size={20} />,
        },
      ],
    },
    {
      title: "CONTENT",
      items: [
        {
          href: `/dashboard/chatbots/${chatbotSlug}/links`,
          label: "Links",
          icon: <LinkIcon size={20} />,
        },
        {
          href: `/dashboard/chatbots/${chatbotSlug}/quick-prompts`,
          label: "Quick Prompts",
          icon: <FileText size={20} />,
        },
      ],
    },
    {
      title: "CONFIGURE",
      items: [
        {
          href: `/dashboard/chatbots/${chatbotSlug}/customization`,
          label: "Customization",
          icon: <Palette size={20} />,
        },
        {
          href: `/dashboard/chatbots/${chatbotSlug}/settings`,
          label: "Settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-0 flex w-64 flex-col border-r bg-card text-card-foreground">
      <header className="p-4">
        <Link href="/dashboard">
          <Image
            src="/logo.svg"
            width={504}
            height={407}
            alt={`${APP_NAME} Logo`}
            className="h-12 w-12 object-contain"
          />
        </Link>
      </header>
      <div className="p-4">
        <p className="pb-1 pl-4 text-xs uppercase text-muted-foreground">
          Chatbot
        </p>
        <ChatbotSwitcher className="w-full" />
      </div>
      <SideBarNav list={list} />
      <div className="p-4">
        <FullUserDropdownButton />
      </div>
    </aside>
  );
};
