import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import ChatbotSwitcher from "@/components/ChatbotSwitcher";
import DevWarningBar from "@/components/DevWarningBar";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import Logo from "@/components/Logo";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { ReactNode } from "react";
import AppBar from "@/components/AppBar";
import { cn } from "@/lib/utils";
import ChatbotWidgetScript from "@/components/ChatbotWidgetScript";
import { useRouter } from "next/router";
import OrgGuard from "@/components/OrgGuard";
import ChatbotGuard from "@/components/ChatbotGuard";

const ChatbotLayout = ({
  children,
  noBottomPadding,
}: {
  children: ReactNode;
  noBottomPadding?: boolean;
}) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  return (
    <ThemeProvider enableSystem attribute="class">
      <OrgGuard>
        <ChatbotGuard>
          <div className="bg-card text-card-foreground fixed bottom-0 left-0 top-0 z-20 w-64 border-r max-lg:hidden">
            <SideBar />
          </div>
          <main
            className={cn("flex min-h-screen flex-1 flex-col lg:ml-64", {
              "pb-32": !noBottomPadding,
            })}
          >
            <DevWarningBar />
            <AppBar />
            {children}
          </main>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent className="p-0" side="left">
              <SideBar />
            </SheetContent>
          </Sheet>
        </ChatbotGuard>
      </OrgGuard>
      <ChatbotWidgetScript />
    </ThemeProvider>
  );
};

export default ChatbotLayout;

const SideBar = () => {
  const router = useRouter();

  const list: SideBarNavProps["list"] = [
    {
      items: [
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}`,
          label: "Overview",
          icon: <LayoutGrid size={20} />,
          end: true,
        },
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/users`,
          label: "Users",
          icon: <Users size={20} />,
        },
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/conversations`,
          label: "Conversations",
          icon: <MessagesSquare size={20} />,
        },
      ],
    },
    {
      title: "CONTENT",
      items: [
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/links`,
          label: "Links",
          icon: <LinkIcon size={20} />,
        },
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/quick-prompts`,
          label: "Quick Prompts",
          icon: <MessageSquareIcon size={20} />,
        },
      ],
    },
    {
      title: "CONFIGURE",
      items: [
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/customization`,
          label: "Customization",
          icon: <Palette size={20} />,
        },
        {
          href: `/${router.query.orgSlug}/chatbots/${router.query.chatbotId}/settings`,
          label: "Settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href={`/${router.query.orgSlug}`}>
          <Logo className="h-12 w-12" />
        </Link>
      </header>
      <div className="p-4">
        <p className="text-muted-foreground pb-1 pl-4 text-xs uppercase">
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
