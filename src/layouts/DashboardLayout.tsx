import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import DevWarningBar from "@/components/DevWarningBar";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import Logo from "@/components/Logo";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAtom } from "jotai";
import { CreditCard, LayoutGrid, Settings } from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <DevWarningBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-card text-card-foreground max-lg:hidden">
          <SideBar />
        </div>
        <main className="flex flex-1 flex-col overflow-auto">{children}</main>
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="p-0" side="left">
          <SideBar />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardLayout;

const SideBar = () => {
  const list: SideBarNavProps["list"] = useMemo(
    () => [
      {
        items: [
          {
            href: "/chatbots",
            label: "Chatbots",
            icon: <LayoutGrid size={20} />,
            end: true,
          },
          {
            href: "/plan-billing",
            label: "Plan & Billing",
            icon: <CreditCard size={20} />,
          },
          {
            href: "/settings/organization",
            label: "Settings",
            icon: <Settings size={20} />,
          },
        ],
      },
    ],
    [],
  );

  return (
    <aside className="flex h-full w-full flex-col">
      <header className="flex justify-start p-4">
        <Link href="/chatbots">
          <Logo className="h-12 w-12" />
        </Link>
      </header>
      <div className="p-4">
        <p className="pb-1 pl-4 text-xs uppercase text-muted-foreground">
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
