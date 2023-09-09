import { useAuth } from "@clerk/nextjs";
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
  const { isLoaded, isSignedIn } = useAuth();
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
    document.documentElement.classList.toggle("overflow-hidden", showMenu);
  }, [showMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b bg-background transition-all md:border-b-transparent md:bg-transparent",
        {
          "md:border-b-border md:bg-background/80 md:backdrop-blur-md":
            scrolled,
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
            const isActive = router.asPath.split("?")[0] === item.href;
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
          {!isLoaded ? (
            <>
              <Skeleton className="h-10 w-[93px] rounded-full" />
              <Skeleton className="h-10 w-[124px] rounded-full" />
            </>
          ) : isSignedIn ? (
            <Button asChild className="rounded-full px-6">
              <Link href="/chatbots">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-6 max-lg:hidden"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full px-6">
                <Link href="/register">Get started</Link>
              </Button>
            </>
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
              const isActive = router.asPath.split("?")[0] === item.href;

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
            {!isLoaded ? (
              <>
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </>
            ) : isSignedIn ? (
              <Button asChild size="lg" onClick={closeSidebar}>
                <Link href="/chatbots">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  onClick={closeSidebar}
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild size="lg" onClick={closeSidebar}>
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
