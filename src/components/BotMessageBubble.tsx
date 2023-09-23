import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Message } from "@prisma/client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChatbotSettings } from "@/utils/validators";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const BotMessageBubble = ({
  message,
  name = "BOT",
  reaction,
  onReact,
  sources = [],
  date,
  theme,
  preview,
}: {
  message: string;
  name?: string;
  reaction?: Message["reaction"];
  onReact?: (reaction: Message["reaction"]) => void;
  sources?: string[];
  date?: Date;
  theme: ChatbotSettings["theme"];
  preview?: boolean;
}) => {
  return (
    <div className="flex flex-col items-start">
      <p className="mb-1 text-sm font-medium uppercase text-muted-foreground">
        {name}
      </p>

      <div className="flex max-w-full justify-start pr-12">
        <div className="relative max-w-full rounded-xl rounded-tl-sm bg-secondary text-secondary-foreground">
          <ReactMarkdown
            className={cn("prose max-w-full overflow-auto p-4", {
              "prose-invert": theme === "dark",
            })}
            remarkPlugins={[remarkGfm]}
          >
            {message}
          </ReactMarkdown>
          {preview && reaction ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -bottom-6 right-4 mt-2 space-x-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md",
                      {
                        "bg-primary text-primary-foreground":
                          reaction === "LIKE",
                        "bg-destructive text-destructive-foreground":
                          reaction === "DISLIKE",
                      },
                    )}
                  >
                    <p className="sr-only">{reaction}</p>
                    {reaction === "LIKE" ? (
                      <ThumbsUp size={16} />
                    ) : (
                      <ThumbsDown size={16} />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Customer {reaction === "LIKE" ? "liked" : "disliked"} this
                message.
              </TooltipContent>
            </Tooltip>
          ) : (
            !!onReact && (
              <div className="absolute -bottom-6 right-4 mt-2 space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={reaction === "LIKE" ? "default" : "outline"}
                      className="h-8 w-8"
                      onClick={() => onReact?.("LIKE")}
                    >
                      <p className="sr-only">Like</p>
                      <ThumbsUp size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like this message</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={
                        reaction === "DISLIKE" ? "destructive" : "outline"
                      }
                      className="h-8 w-8"
                      onClick={() => onReact?.("DISLIKE")}
                    >
                      <p className="sr-only">Dislike</p>
                      <ThumbsDown size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dislike this message</TooltipContent>
                </Tooltip>
              </div>
            )
          )}
        </div>
      </div>

      {date && (
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </p>
      )}

      {sources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((source, i) => (
            <Button
              key={i}
              size="sm"
              variant="secondary"
              asChild
              className="h-fit px-2 py-1"
            >
              <Link href={source} target="_blank">
                {source}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BotMessageBubble;
