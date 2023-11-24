import { ReactNode, useMemo } from "react";
import AuthLayout from "./AuthLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import DashboardPageHeader from "@/components/DashboardPageHeader";

const AccountSettingsLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const menu = useMemo(
    () => [
      {
        href: `/settings/account`,
        label: "General",
        end: true,
      },
      {
        href: `/settings/account/advanced`,
        label: "Advanced",
      },
    ],
    [],
  );

  return (
    <AuthLayout>
      <DashboardPageHeader title="Account Settings" />
      <div className="container">
        <div className="flex gap-8 max-xl:flex-col">
          <nav className="flex w-64 gap-1 xl:flex-col">
            {menu.map((item) => (
              <Button
                key={item.href}
                asChild
                className={cn("lg:justify-start lg:text-left", {
                  "bg-accent text-accent-foreground": item.end
                    ? router.asPath === item.href
                    : router.asPath.startsWith(item.href),
                })}
                variant="ghost"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="flex-1 space-y-8">{children}</div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AccountSettingsLayout;
