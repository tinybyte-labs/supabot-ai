import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EndCTA = () => {
  return (
    <section className="my-48">
      <div className="container">
        <div className="mx-auto max-w-screen-md">
          <h2 className="text-center text-4xl font-bold md:text-5xl">
            Ready to Elevate Your Website&apos;s Conversations?
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Unlock the Power of SupaBot AI and Transform Your Web Experience
            Today. Join the Conversation!
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            href="/register"
            className="flex h-14 w-fit shrink-0 items-center justify-center gap-4 whitespace-nowrap rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started Now!
            <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EndCTA;
