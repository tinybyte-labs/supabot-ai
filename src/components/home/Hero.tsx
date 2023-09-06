import { HERO_SUBTITLE, HERO_TITLE } from "@/utils/constants/strings";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="my-24">
      <div className="container">
        <div className="mx-auto max-w-screen-lg">
          <div className="bg-gradient-to-br from-accent-foreground to-accent-foreground/70 bg-clip-text py-1">
            <h1 className="text-center text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-7xl">
              {HERO_TITLE}
            </h1>
          </div>
          <p className="mt-6 text-center font-medium text-muted-foreground md:text-lg lg:text-xl">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-14 flex items-center justify-center gap-4 max-md:flex-col md:gap-6">
            <Link
              href="/register"
              className="flex h-14 w-full items-center justify-center gap-4 whitespace-nowrap rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:w-56"
            >
              Get Started
              <ArrowRight size={24} />
            </Link>
            <Link
              href="https://github.com/iam-rohid/supabot-ai"
              target="_blank"
              className="flex h-14 w-full items-center justify-center gap-4 whitespace-nowrap rounded-full border border-foreground/20 bg-transparent px-8 font-semibold text-secondary-foreground transition-colors hover:bg-secondary md:w-56"
            >
              <Star size={24} />
              Star on Github
            </Link>
          </div>
        </div>

        <div className="relative mt-24">
          <Image
            src="/assets/home-main-screenshot-dark.png"
            alt="Screenshot"
            width={2880}
            height={1800}
            className="hidden w-full rounded-2xl border dark:block"
            loading="lazy"
          />
          <Image
            src="/assets/home-main-screenshot-light.png"
            alt="Screenshot"
            width={2880}
            height={1800}
            className="w-full rounded-2xl border dark:hidden"
            loading="lazy"
          />
          <div className="absolute inset-0 -z-10 bg-foreground/5 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
