import { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/router";
import ChatbotLayout from "./ChatbotLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ChatbotSettingsLayout = ({ children }: { children: ReactNode }) => {
  const {
    query: { chatbotSlug },
    asPath,
  } = useRouter();

  const menu = [
    {
      href: `/dashboard/chatbots/${chatbotSlug}/settings`,
      label: "General",
      end: true,
    },
    {
      href: `/dashboard/chatbots/${chatbotSlug}/settings/advanced`,
      label: "Advanced",
    },
  ];

  return (
    <ChatbotLayout>
      <PageHeader title="Settings" />
      <div className="container my-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
        <nav className="sticky top-8 flex w-64 gap-px lg:flex-col">
          {menu.map((item) => (
            <Button
              key={item.href}
              asChild
              className={cn("lg:justify-start lg:text-left", {
                "bg-accent text-accent-foreground": item.end
                  ? asPath === item.href
                  : asPath.startsWith(item.href),
              })}
              variant="ghost"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex-1 space-y-8">{children}</div>
      </div>
    </ChatbotLayout>
  );
};

export default ChatbotSettingsLayout;
