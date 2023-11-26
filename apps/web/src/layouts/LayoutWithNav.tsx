import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export type NavItem = {
  href: string;
  label: string;
  end?: boolean;
};

export type LayoutWithNavProps = {
  children: ReactNode;
  menu: NavItem[];
};

const LayoutWithNav = ({ children, menu }: LayoutWithNavProps) => {
  const router = useRouter();

  return (
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
        <div className="flex-1 space-y-8 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default LayoutWithNav;
