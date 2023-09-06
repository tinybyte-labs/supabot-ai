import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import FullLogo from "./FullLogo";
import { APP_NAME } from "@/utils/constants";

export default function MarketingHeader() {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <header>
      <div className="container flex h-20 items-center">
        <div className="flex-1">
          <Link href="/home" className="mr-6 flex w-fit items-center gap-2">
            <FullLogo className="h-10 w-fit" />
            <p className="sr-only">{APP_NAME}</p>
          </Link>
        </div>
        <nav className="flex items-center max-lg:hidden">
          {[
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
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap p-4 text-center font-medium text-muted-foreground transition-all hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          {!isLoaded ? (
            <>
              <Skeleton className="h-10 w-[93px] rounded-full" />
              <Skeleton className="h-10 w-[124px] rounded-full" />
            </>
          ) : isSignedIn ? (
            <Link
              href="/dashboard"
              className="flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-6 text-center text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="flex h-10 items-center whitespace-nowrap rounded-full bg-transparent px-6 text-center text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-6 text-center text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
