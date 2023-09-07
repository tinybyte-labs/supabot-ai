import { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export type SideBarNavProps = {
  list: {
    title?: string;
    items: {
      href: string;
      label: string;
      icon: ReactNode;
      end?: boolean;
      subtitle?: string;
    }[];
  }[];
};

export default function SideBarNav({ list }: SideBarNavProps) {
  const { asPath } = useRouter();
  return (
    <nav className="space-y-6">
      {list.map((group, i) => (
        <div key={i}>
          {group.title && (
            <div className="pb-2 pl-4 text-xs text-muted-foreground">
              {group.title}
            </div>
          )}
          <div className="flex flex-col gap-1 overflow-hidden">
            {group.items.map((item, j) => {
              const isActive = item.end
                ? asPath.split("?")[0] === item.href.split("?")[0]
                : asPath.split("?")[0].startsWith(item.href.split("?")[0]);
              return (
                <Button
                  key={j}
                  asChild
                  variant="ghost"
                  className={cn("flex h-fit w-full", {
                    "bg-accent text-accent-foreground": isActive,
                    "text-muted-foreground": !isActive,
                  })}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <div className="ml-3 flex-1 overflow-hidden">
                      <p className="truncate">{item.label}</p>
                      {!!item.subtitle && (
                        <p className="text-xs text-muted-foreground">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
