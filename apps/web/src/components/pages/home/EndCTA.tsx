import { APP_NAME } from "@/utils/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EndCTA = () => {
  return (
    <section id="end-cta" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Ready to Elevate Your Website&apos;s Conversations?
          </h2>
          <p className="text-muted-foreground mt-4 text-center font-medium md:text-lg">
            Unlock the Power of {APP_NAME} and Transform Your Web Experience
            Today. Join the Conversation!
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <Button asChild className="h-14 rounded-full px-12 text-base">
            <Link href="/signin">
              Get Started Now!
              <ArrowRight size={24} className="-mr-2 ml-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EndCTA;
