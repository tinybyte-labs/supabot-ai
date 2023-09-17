import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import ChatbotSwitcher from "@/components/ChatbotSwitcher";
import DevWarningBar from "@/components/DevWarningBar";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import Logo from "@/components/Logo";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChatbotProvider } from "@/providers/ChatbotProvider";
import { useAtom } from "jotai";
import {
  LayoutGrid,
  Users,
  MessagesSquare,
  LinkIcon,
  Palette,
  Settings,
  MessageSquareIcon,
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const ChatbotLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <ThemeProvider enableSystem attribute="class">
      <ChatbotProvider>
        <DevWarningBar />
        <div className="fixed bottom-0 left-0 top-0 w-64 border-r bg-card text-card-foreground max-lg:hidden">
          <SideBar />
        </div>
        <main className="flex min-h-screen flex-1 flex-col lg:ml-64">
          {children}
        </main>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent className="p-0" side="left">
            <SideBar />
          </SheetContent>
        </Sheet>
      </ChatbotProvider>
    </ThemeProvider>
  );
};

export default ChatbotLayout;

const SideBar = () => {
  const {
    query: { chatbotId },
  } = useRouter();
  const list: SideBarNavProps["list"] = [
    {
      items: [
        {
          href: `/chatbots/${chatbotId}`,
          label: "Overview",
          icon: <LayoutGrid size={20} />,
          end: true,
        },
        {
          href: `/chatbots/${chatbotId}/users`,
          label: "Users",
          icon: <Users size={20} />,
        },
        {
          href: `/chatbots/${chatbotId}/conversations`,
          label: "Conversations",
          icon: <MessagesSquare size={20} />,
        },
      ],
    },
    {
      title: "CONTENT",
      items: [
        {
          href: `/chatbots/${chatbotId}/links`,
          label: "Links",
          icon: <LinkIcon size={20} />,
        },
        {
          href: `/chatbots/${chatbotId}/quick-prompts`,
          label: "Quick Prompts",
          icon: <MessageSquareIcon size={20} />,
        },
      ],
    },
    {
      title: "CONFIGURE",
      items: [
        {
          href: `/chatbots/${chatbotId}/customization`,
          label: "Customization",
          icon: <Palette size={20} />,
        },
        {
          href: `/chatbots/${chatbotId}/settings`,
          label: "Settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href="/chatbots">
          <Logo className="h-12 w-12" />
        </Link>
      </header>
      <div className="p-4">
        <p className="pb-1 pl-4 text-xs uppercase text-muted-foreground">
          Chatbot
        </p>
        <ChatbotSwitcher className="w-full" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SideBarNav list={list} />
      </div>
      <div className="p-4">
        <FullUserDropdownButton />
      </div>
    </aside>
  );
};
