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
  Loader2,
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import AppBar from "@/components/AppBar";
import { cn } from "@/lib/utils";
import ChatbotWidgetScript from "@/components/ChatbotWidgetScript";
import { useChatbot } from "@/hooks/useChatbot";

const ChatbotLayout = ({
  children,
  noBottomPadding,
}: {
  children: ReactNode;
  noBottomPadding?: boolean;
}) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const { isLoading, isError, error, data: chatbot } = useChatbot();
  return (
    <ThemeProvider enableSystem attribute="class">
      {isLoading ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p>Error: {error.message}</p>
        </div>
      ) : !chatbot ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <p>Chatbot not found!</p>
        </div>
      ) : (
        <>
          <DevWarningBar />
          <div className="bg-card text-card-foreground fixed bottom-0 left-0 top-0 w-64 border-r max-lg:hidden">
            <SideBar />
          </div>
          <main
            className={cn("flex min-h-screen flex-1 flex-col lg:ml-64", {
              "pb-16": !noBottomPadding,
            })}
          >
            <AppBar />
            {children}
          </main>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent className="p-0" side="left">
              <SideBar />
            </SheetContent>
          </Sheet>
        </>
      )}

      <ChatbotWidgetScript />
    </ThemeProvider>
  );
};

export default ChatbotLayout;

const SideBar = () => {
  const router = useRouter();
  const { chatbotId, orgSlug } = router.query as {
    chatbotId: string;
    orgSlug: string;
  };

  const list: SideBarNavProps["list"] = [
    {
      items: [
        {
          href: `/${orgSlug}/chatbots/${chatbotId}`,
          label: "Overview",
          icon: <LayoutGrid size={20} />,
          end: true,
        },
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/users`,
          label: "Users",
          icon: <Users size={20} />,
        },
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/conversations`,
          label: "Conversations",
          icon: <MessagesSquare size={20} />,
        },
      ],
    },
    {
      title: "CONTENT",
      items: [
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/links`,
          label: "Links",
          icon: <LinkIcon size={20} />,
        },
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/quick-prompts`,
          label: "Quick Prompts",
          icon: <MessageSquareIcon size={20} />,
        },
      ],
    },
    {
      title: "CONFIGURE",
      items: [
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/customization`,
          label: "Customization",
          icon: <Palette size={20} />,
        },
        {
          href: `/${orgSlug}/chatbots/${chatbotId}/settings`,
          label: "Settings",
          icon: <Settings size={20} />,
        },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href={`/${orgSlug}`}>
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
