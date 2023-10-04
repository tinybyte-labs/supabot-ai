import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import FullLogo from "./FullLogo";
import { APP_NAME } from "@/utils/constants";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const menu = [
  {
    label: "Demo",
    href: "/home#demo",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Changelog",
    href: "/changelog",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Help",
    href: "/help",
  },
];
export default function MarketingHeader() {
  const { data, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    if (y > 4 && !scrolled) {
      setScrolled(true);
    } else if (y <= 4 && scrolled) {
      setScrolled(false);
    }
  }, [scrolled]);

  const closeSidebar = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "max-md:overflow-hidden",
      showMenu,
    );
  }, [showMenu]);

  return (
    <header
      className={cn(
        "bg-background sticky left-0 right-0 top-0 z-30 border-b transition-all md:border-b-transparent md:bg-transparent",
        {
          "md:border-b-border md:bg-background/80 md:backdrop-blur-md":
            scrolled,
          "max-md:fixed": showMenu,
        },
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="lg:flex-1">
          <Link href="/home" className="mr-6 flex w-fit items-center gap-2">
            <FullLogo className="h-10 w-fit max-lg:hidden" />
            <Logo className="h-12 w-12 lg:hidden" />
            <p className="sr-only">{APP_NAME}</p>
          </Link>
        </div>
        <nav className="flex items-center gap-1 max-md:hidden">
          {menu.map((item) => {
            const isActive = router.asPath.split("?")[0].startsWith(item.href);
            return (
              <Button
                asChild
                key={item.href}
                variant="ghost"
                className={cn(
                  "rounded-full bg-transparent hover:bg-transparent",
                  {
                    "text-secondary-foreground": isActive,
                    "text-muted-foreground": !isActive,
                  },
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2 max-md:hidden">
          {status === "loading" ? (
            <>
              <Skeleton className="h-10 w-[93px] rounded-full" />
              <Skeleton className="h-10 w-[124px] rounded-full" />
            </>
          ) : status === "authenticated" ? (
            <Button asChild className="rounded-full px-6">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild className="rounded-full px-6 max-lg:hidden">
              <Link href="/signin">Get Started</Link>
            </Button>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      {showMenu && (
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto border-t p-6 md:hidden">
          <nav className="flex flex-col gap-1">
            {menu.map((item, i) => {
              const isActive = router.asPath
                .split("?")[0]
                .startsWith(item.href);

              return (
                <Button
                  asChild
                  key={item.href}
                  variant="ghost"
                  size="lg"
                  className={cn("justify-start px-4", {
                    "bg-secondary text-secondary-foreground": isActive,
                  })}
                  onClick={closeSidebar}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              );
            })}
          </nav>

          <div className="mt-12 flex flex-col gap-2">
            {status === "loading" ? (
              <>
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </>
            ) : status === "authenticated" ? (
              <Button asChild size="lg" onClick={closeSidebar}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" onClick={closeSidebar}>
                <Link href="/signin">Get started</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
