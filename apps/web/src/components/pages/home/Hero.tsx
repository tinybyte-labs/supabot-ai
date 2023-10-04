import { HERO_SUBTITLE, HERO_TITLE } from "@/utils/constants/strings";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="hero" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-screen-sm md:max-w-screen-lg">
          <div className="from-accent-foreground to-accent-foreground/70 bg-gradient-to-br bg-clip-text py-1">
            <h1 className="text-center text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-7xl">
              {HERO_TITLE}
            </h1>
          </div>
          <p className="text-muted-foreground mt-6 text-center font-medium md:text-lg lg:text-xl">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-14 flex items-center justify-center gap-6 max-md:flex-col">
            <Button
              asChild
              className="h-14 rounded-full px-12 text-base"
              size="lg"
            >
              <Link href="/signin">
                Get Started
                <ArrowRight size={24} className="-mr-2 ml-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-14 rounded-full bg-transparent px-12 text-base"
              size="lg"
              variant="outline"
            >
              <Link href="/github" target="_blank">
                <Star size={24} className="-ml-2 mr-4" />
                Star on Github
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-14 md:mt-24">
          <Image
            src="/assets/home-main-screenshot-dark.png"
            alt="Screenshot"
            width={2880}
            height={1800}
            className="hidden w-full rounded-lg border dark:block md:rounded-2xl"
            quality={60}
          />
          <Image
            src="/assets/home-main-screenshot-light.png"
            alt="Screenshot"
            width={2880}
            height={1800}
            className="w-full rounded-lg border dark:hidden md:rounded-2xl"
            quality={60}
          />
          <div className="bg-foreground/5 absolute inset-0 -z-10 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
