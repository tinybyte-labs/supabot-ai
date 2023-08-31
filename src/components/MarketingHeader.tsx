import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Logo from "./Logo";

export default function MarketingHeader() {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container flex h-20 items-center">
        <Link href="/home" className="mr-6 flex items-center gap-2">
          <Logo className="h-10 w-10" />
          <p className="text-lg font-bold tracking-tight">SupaBot AI</p>
        </Link>
        <nav className="flex items-center max-lg:hidden">
          <Link
            href="/about"
            className="p-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="p-4 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/demo"
            className="p-4 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
          >
            Demo
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link
              href="https://github.com/iam-rohid/supabot-ai"
              target="_blank"
            >
              <Star size={18} className="-ml-1 mr-2" />
              Star on Github
            </Link>
          </Button>
          {!isLoaded ? (
            <Skeleton className="h-10 w-[124px]" />
          ) : isSignedIn ? (
            <Button asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="-mr-1 ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  Get started for free
                  <ArrowRight className="-mr-1 ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
