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
          <div className="grid gap-1">
            {group.items.map((item, j) => {
              const isActive = item.end
                ? asPath.split("?")[0] === item.href.split("?")[0]
                : asPath.split("?")[0].startsWith(item.href.split("?")[0]);
              return (
                <Button
                  key={j}
                  asChild
                  variant="ghost"
                  className={cn({
                    "bg-accent text-accent-foreground": isActive,
                    "text-muted-foreground": !isActive,
                  })}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <p className="ml-2 flex-1 truncate">{item.label}</p>
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
