import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import DevWarningBar from "@/components/DevWarningBar";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import Logo from "@/components/Logo";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAtom } from "jotai";
import { CreditCard, LayoutGrid, Settings, Users } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import AppBar from "@/components/AppBar";
import ChatbotWidgetScript from "@/components/ChatbotWidgetScript";
import OrgGuard from "@/components/OrgGuard";
import { useRouter } from "next/router";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <ThemeProvider enableSystem attribute="class">
      <OrgGuard>
        <div className="bg-card text-card-foreground fixed bottom-0 left-0 top-0 z-20 w-64 border-r max-lg:hidden">
          <SideBar />
        </div>
        <main className="min-h-screen flex-1 flex-col pb-16 lg:ml-64">
          <DevWarningBar />
          <AppBar />
          {children}
        </main>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent className="p-0" side="left">
            <SideBar />
          </SheetContent>
        </Sheet>
      </OrgGuard>
      <ChatbotWidgetScript />
    </ThemeProvider>
  );
};

export default DashboardLayout;

const SideBar = () => {
  const router = useRouter();
  const list: SideBarNavProps["list"] = useMemo(
    () => [
      {
        items: [
          {
            href: `/${router.query.orgSlug}`,
            label: "Chatbots",
            icon: <LayoutGrid size={20} />,
            end: true,
          },
          {
            href: `/${router.query.orgSlug}/plan-billing`,
            label: "Plan & Billing",
            icon: <CreditCard size={20} />,
          },
          {
            href: `/${router.query.orgSlug}/members`,
            label: "Members",
            icon: <Users size={20} />,
          },
          {
            href: `/${router.query.orgSlug}/settings`,
            label: "Settings",
            icon: <Settings size={20} />,
          },
        ],
      },
    ],
    [router.query.orgSlug],
  );

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href={`/${router.query.orgSlug}`}>
          <Logo className="h-12 w-12" />
        </Link>
      </header>
      <div className="p-4">
        <p className="text-muted-foreground pb-1 pl-4 text-xs uppercase">
          organization
        </p>
        <OrganizationSwitcher className="w-full" />
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
