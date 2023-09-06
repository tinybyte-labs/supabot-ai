import FullLogo from "@/components/FullLogo";
import MarketingHeader from "@/components/MarketingHeader";
import ThemeTogglerIconButton from "@/components/ThemeTogglerIconButton";
import { Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <footer className="h-48 border-t">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-3 md:gap-12 lg:grid-cols-6">
            <div className="col-span-2 flex flex-col gap-6 md:col-span-3">
              <Link href="/home">
                <FullLogo className="h-12 w-fit" />
              </Link>
              <p className="text-muted-foreground">
                Transform your web experience with SupaBot AI, the future of
                conversational AI. Craft a personalized chatbot tailored to your
                website&apos;s content. Enhance customer engagement and boost
                conversions.
              </p>
              <div className="flex gap-6">
                <Link href="https://twitter.com/SupaBotAI">
                  <Twitter
                    size={24}
                    className="text-muted-foreground hover:text-accent-foreground"
                  />
                  <p className="sr-only">Twitter</p>
                </Link>
                <Link href="https://github.com/iam-rohid/supabot-ai">
                  <Github
                    size={24}
                    className="text-muted-foreground hover:text-accent-foreground"
                  />
                  <p className="sr-only">Github</p>
                </Link>
                <Link href="https://instagram.com">
                  <Instagram
                    size={24}
                    className="text-muted-foreground hover:text-accent-foreground"
                  />
                  <p className="sr-only">Instagram</p>
                </Link>
              </div>
            </div>
            <div className="col-span-1">
              <p className="mb-4 font-medium">Product</p>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    Change Log
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1">
              <p className="mb-4 font-medium">Company</p>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1">
              <p className="mb-4 font-medium">Legal</p>
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-accent-foreground"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex items-center border-t py-6">
          <p className="text-muted-foreground">© 2023 supabotai.com</p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
