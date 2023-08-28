import { sidebarOpenAtom } from "@/atoms/sidebarOpen";
import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import SideBarNav, { SideBarNavProps } from "@/components/SideBarNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { APP_NAME } from "@/utils/constants";
import { useAtom } from "jotai";
import { CreditCard, LayoutGrid, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 w-64 border-r bg-card text-card-foreground max-lg:hidden">
        <SideBar />
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="p-0" side="left">
          <SideBar />
        </SheetContent>
      </Sheet>
      <main className="lg:ml-64">{children}</main>
    </>
  );
};

export default DashboardLayout;

const SideBar = () => {
  const list: SideBarNavProps["list"] = useMemo(
    () => [
      {
        items: [
          {
            href: "/dashboard",
            label: "Chatbots",
            icon: <LayoutGrid size={20} />,
            end: true,
          },
          {
            href: "/dashboard/plan-billing",
            label: "Plan & Billing",
            icon: <CreditCard size={20} />,
          },
          {
            href: "/dashboard/settings",
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
