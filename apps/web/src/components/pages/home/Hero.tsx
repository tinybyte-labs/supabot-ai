import { HERO_SUBTITLE, HERO_TITLE } from "@/utils/constants/strings";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="hero" className="py-32">
      <div className="container">
        <div className="mx-auto max-w-screen-sm md:max-w-screen-lg">
          <h1 className="text-center text-4xl font-bold tracking-tight opacity-90 md:text-5xl lg:text-6xl">
            {HERO_TITLE}
          </h1>
          <p className="mx-auto mt-4 max-w-screen-sm text-center font-medium opacity-60 md:text-lg">
            {HERO_SUBTITLE}
          </p>

          <div className="mt-14 flex items-center justify-center gap-6 max-md:flex-col">
            <Button
              asChild
              className="h-14 rounded-full px-12 text-base"
              size="lg"
              variant="primary"
            >
              <Link href="/signin">
                Get Started
                <ArrowRight size={24} className="-mr-2 ml-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-14 rounded-full bg-white/5 px-12 text-base hover:border-white/30 hover:bg-white/10"
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

        <div className="relative z-10 mt-16 md:mt-32">
          <div className="overflow-hidden rounded-xl border-4 border-white/10 ring-1 ring-white/30 md:rounded-3xl md:border-8">
            <Image
              src="/assets/home-main-screenshot.png"
              alt="Screenshot"
              width={2880}
              height={1800}
              className="bg-background w-full"
              quality={60}
            />
          </div>
          <div className="absolute -left-10 -top-10 -z-10 h-[500px] w-[500px] rotate-45 scale-y-125 rounded-[100px] bg-indigo-500/30 blur-[120px]"></div>
          <div className="absolute -right-0 top-10 -z-10 h-[500px] w-[500px] scale-x-125 rounded-[100px] bg-pink-500/30 blur-[140px]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
