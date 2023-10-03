import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import DevWarningBar from "@/components/DevWarningBar";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import Logo from "@/components/Logo";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAtom } from "jotai";
import { CreditCard, LayoutGrid, Settings } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import Script from "next/script";
import { BASE_DOMAIN } from "@/utils/constants";
import AppBar from "@/components/AppBar";
import { useRouter } from "next/router";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <ThemeProvider enableSystem attribute="class">
      <DevWarningBar />
      <div className="bg-card text-card-foreground fixed bottom-0 left-0 top-0 w-64 border-r max-lg:hidden">
        <SideBar />
      </div>
      <main className="min-h-screen flex-1 flex-col pb-16 lg:ml-64">
        <AppBar />
        {children}
      </main>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="p-0" side="left">
          <SideBar />
        </SheetContent>
      </Sheet>
      <Script
        strategy="lazyOnload"
        src={`${BASE_DOMAIN}/api/widget/js?id=${process.env.NEXT_PUBLIC_CHATBOT_ID}`}
      ></Script>
    </ThemeProvider>
  );
};

export default DashboardLayout;

const SideBar = () => {
  const router = useRouter();
  const orgSlug = router.query.orgSlug as string;
  const list: SideBarNavProps["list"] = useMemo(
    () => [
      {
        items: [
          {
            href: `/${orgSlug}`,
            label: "Chatbots",
            icon: <LayoutGrid size={20} />,
            end: true,
          },
          {
            href: `/${orgSlug}/plan-billing`,
            label: "Plan & Billing",
            icon: <CreditCard size={20} />,
          },
          {
            href: `/${orgSlug}/settings`,
            label: "Settings",
            icon: <Settings size={20} />,
          },
        ],
      },
    ],
    [orgSlug],
  );

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href={`/${orgSlug}`}>
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
