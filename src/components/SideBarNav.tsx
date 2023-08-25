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
    <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
      {list.map((group, i) => (
        <div key={i}>
          {group.title && (
            <div className="pl-4 text-xs text-muted-foreground pb-2">
              {group.title}
            </div>
          )}
          <div className="grid gap-px">
            {group.items.map((item, j) => (
              <Button
                key={j}
                asChild
                variant="ghost"
                className={cn({
                  "bg-accent text-accent-foreground": item.end
                    ? asPath === item.href
                    : asPath.startsWith(item.href),
                })}
              >
                <Link href={item.href}>
                  {item.icon}
                  <p className="flex-1 truncate ml-2">{item.label}</p>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
