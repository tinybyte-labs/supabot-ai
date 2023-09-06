import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import FullLogo from "./FullLogo";
import { APP_NAME } from "@/utils/constants";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useRouter } from "next/router";

const menu = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Demo",
    href: "/demo",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];
export default function MarketingHeader() {
  const { isLoaded, isSignedIn } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const handleScroll = useCallback(() => {
    console.log("CALLED");
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
    if (!showMenu) return;
    router.events.on("routeChangeStart", closeSidebar);
    return () => {
      router.events.off("routeChangeStart", closeSidebar);
    };
  }, [closeSidebar, router.events, showMenu]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-30 max-md:border-b max-md:bg-background/90 max-md:backdrop-blur-md",
          {
            "border-b bg-background/90 backdrop-blur-md": scrolled,
          },
        )}
      >
        <div className="container flex h-16 items-center md:h-20">
          <div className="lg:flex-1">
            <Link href="/home" className="mr-6 flex w-fit items-center gap-2">
              <FullLogo className="h-10 w-fit max-lg:hidden" />
              <Logo className="h-12 w-12 lg:hidden" />
              <p className="sr-only">{APP_NAME}</p>
            </Link>
          </div>
          <nav className="flex items-center max-md:hidden">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap p-4 text-center font-medium text-muted-foreground transition-all hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2 max-md:hidden">
            {!isLoaded ? (
              <>
                <Skeleton className="h-10 w-[93px] rounded-full" />
                <Skeleton className="h-10 w-[124px] rounded-full" />
              </>
            ) : isSignedIn ? (
              <Link
                href="/chatbots"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-center text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-transparent px-6 text-center text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary max-lg:hidden"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-center text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Get started
                </Link>
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
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto md:hidden">
            <div className="container p-4">
              <div className="flex flex-col gap-2">
                {!isLoaded ? (
                  <>
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                  </>
                ) : isSignedIn ? (
                  <Link
                    href="/chatbots"
                    className="flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-6 text-center font-medium text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-secondary px-6 text-center font-medium text-secondary-foreground transition-all hover:bg-secondary/90"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex h-12 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-6 text-center font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>

              <nav className="mt-4 flex flex-col">
                {menu.map((item, i) => (
                  <Fragment key={item.href}>
                    <Link
                      href={item.href}
                      className="flex h-14 items-center whitespace-nowrap px-4 font-medium text-muted-foreground transition-colors hover:text-accent-foreground"
                    >
                      {item.label}
                    </Link>

                    {i < menu.length - 1 && <hr className="h-px bg-border" />}
                  </Fragment>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="h-16 md:h-20"></div>
    </>
  );
}
