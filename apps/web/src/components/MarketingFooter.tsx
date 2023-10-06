import Link from "next/link";
import FullLogo from "./FullLogo";
import { APP_NAME } from "@/utils/constants";
import { ReactNode } from "react";
import DiscordIcon from "./DiscordIcon";
import TwitterIcon from "./TwitterIcon";
import GithubIcon from "./GithubIcon";

const MarketingFooter = () => {
  return (
    <footer className="bg-background relative border-t border-t-white/10">
      <div className="absolute -top-[40px] left-[420px] -z-10 h-[80px] w-[80px] scale-x-[3] rounded-[300px] bg-indigo-500 blur-[40px]"></div>
      <div className="absolute -top-[60px] left-[800px] -z-10 h-[120px] w-[120px] scale-x-[3] rounded-[300px] bg-pink-500 blur-[60px]"></div>
      <div className="container">
        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 md:gap-12 md:py-16 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col items-start gap-6 md:col-span-3">
            <Link href="/home">
              <FullLogo className="h-12 w-fit" />
              <p className="sr-only">{APP_NAME}</p>
            </Link>
            <p className="text-muted-foreground">
              Elevate your web experience with SupaBot AI, creating personalized
              chatbots for enhanced customer engagement and higher conversions.
            </p>
          </div>
          <Nav
            title="Company"
            items={[
              {
                href: "/changelog",
                label: "Changelog",
              },
              {
                href: "/blog",
                label: "Blog",
              },
              {
                href: "/docs",
                label: "Docs",
              },
              {
                href: "/help",
                label: "Help",
              },
              {
                href: "/contact",
                label: "Contact Us",
              },
            ]}
          />
          <Nav
            title="Community"
            items={[
              {
                icon: <GithubIcon fontSize={18} />,
                href: "/github",
                label: "Github",
              },
              {
                icon: <DiscordIcon fontSize={18} />,
                href: "/discord",
                label: "Discord",
              },
              {
                icon: <TwitterIcon fontSize={18} />,
                href: "/twitter",
                label: "Twitter",
              },
            ]}
          />
          <Nav
            title="Legal"
            items={[
              {
                href: "/privicy",
                label: "Privacy",
              },
              {
                href: "/terms",
                label: "Terms",
              },
              {
                href: "/abuse",
                label: "Abuse",
              },
            ]}
          />
        </div>
      </div>
      <div className="container flex items-center border-t py-8">
        <p className="text-muted-foreground">© 2023 supabotai.com</p>
      </div>
    </footer>
  );
};

export default MarketingFooter;

const Nav = ({
  title,
  items,
}: {
  title: string;
  items: {
    icon?: ReactNode;
    href: string;
    label: string;
    external?: boolean;
  }[];
}) => {
  return (
    <div className="col-span-1">
      <h3 className="text-muted-foreground font-medium uppercase">{title}</h3>
      <ul className="mt-6 flex flex-col space-y-2">
        {items.map((item, i) => (
          <li key={`${item.href}-${i}`}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              className="text-foreground hover:text-foreground/70 inline-flex items-center gap-2"
            >
              {item.icon}
              <p className="leading-6">{item.label}</p>
              {item.external && (
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M6.01 10.49a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l8.49-8.48c.2-.2.51-.2.71 0c.2.2.2.51 0 .71l-8.5 8.48c-.1.1-.23.15-.35.15Z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M14.5 7c-.28 0-.5-.22-.5-.5V2H9.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5Zm-3 8H2.49C1.67 15 1 14.33 1 13.51V4.49C1 3.67 1.67 3 2.49 3H7.5c.28 0 .5.22.5.5s-.22.5-.5.5H2.49a.49.49 0 0 0-.49.49v9.02c0 .27.22.49.49.49h9.01c.27 0 .49-.22.49-.49V8.5c0-.28.22-.5.5-.5s.5.22.5.5v5.01c0 .82-.67 1.49-1.49 1.49Z"
                  ></path>
                </svg>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
