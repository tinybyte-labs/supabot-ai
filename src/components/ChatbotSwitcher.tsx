import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLabel,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { trpc } from "@/utils/trpc";

const ChatbotSwitcher = ({ className }: { className?: string }) => {
  const {
    isReady,
    query: { chatbotSlug },
  } = useRouter();
  const { isSuccess: chatbotLoaded, data: currentChatbot } =
    trpc.chatbot.findBySlug.useQuery(chatbotSlug as string, {
      enabled: isReady,
    });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const chatbots = trpc.chatbot.list.useQuery();

  if (!(chatbotLoaded && currentChatbot)) {
    return <Skeleton className={cn("h-10 min-w-[180px]", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("justify-start text-left", className)}
        >
          <Avatar className="-ml-1 mr-2 h-6 w-6">
            {currentChatbot?.image && (
              <AvatarImage src={currentChatbot.image} />
            )}
            <AvatarFallback>
              <Image
                src={`/api/avatar.svg?seed=${currentChatbot.id}&initials=${currentChatbot.slug}&size=128`}
                width={128}
                height={128}
                alt=""
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">{currentChatbot.name}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search chatbot..." />
          <CommandEmpty>No chatbot found.</CommandEmpty>
          <CommandGroup>
            {chatbots.data?.map((chatbot) => (
              <CommandItem
                key={chatbot.slug}
                onSelect={() => {
                  router.push(`/chatbots/${chatbot.slug}`);
                  setOpen(false);
                }}
              >
                <Avatar className="-ml-1 mr-2 h-6 w-6">
                  {chatbot?.image && <AvatarImage src={chatbot?.image} />}
                  <AvatarFallback>
                    <Image
                      src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.slug}&size=128`}
                      width={128}
                      height={128}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="sr-only">{chatbot.slug}</p>
                  {chatbot.name}
                </div>
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    currentChatbot.slug === chatbot.slug
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem onSelect={() => router.push("/chatbots/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Chatbot
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChatbotSwitcher;
