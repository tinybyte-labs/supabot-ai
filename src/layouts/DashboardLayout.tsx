import FullUserDropdownButton from "@/components/FullUserDropdownButton";
import OrganizationSwitcher from "@/components/OrganizationSwitcher";
import SideBarNav from "@/components/SideBarNav";
import { APP_NAME } from "@/utils/constants";
import { CreditCard, LayoutGrid, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SideBar />
      <main className="ml-64">{children}</main>
    </>
  );
};

export default DashboardLayout;

const SideBar = () => {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-card text-card-foreground border-r flex flex-col">
      <header className="p-4">
        <Link href="/dashboard">
          <Image
            src="/logo.svg"
            width={504}
            height={407}
            alt={`${APP_NAME} Logo`}
            className="w-12 h-12 object-contain"
          />
        </Link>
      </header>
      <div className="p-4">
        <p className="pl-4 text-xs text-muted-foreground pb-1 uppercase">
          organization
        </p>
        <OrganizationSwitcher className="w-full" />
      </div>
      <SideBarNav
        list={[
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
        ]}
      />
      <div className="p-4">
        <FullUserDropdownButton />
      </div>
    </aside>
  );
};
