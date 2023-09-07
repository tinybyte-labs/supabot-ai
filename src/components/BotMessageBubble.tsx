import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Message } from "@prisma/client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const BotMessageBubble = ({
  message,
  name = "BOT",
  reaction,
  onReact,
  sources = [],
  date,
}: {
  message: string;
  name?: string;
  reaction?: Message["reaction"];
  onReact?: (reaction: Message["reaction"]) => void;
  sources?: string[];
  date?: Date;
}) => {
  return (
    <div className="flex justify-start pr-12">
      <div className="flex flex-col items-start">
        <p className="mb-2 text-sm font-medium uppercase text-muted-foreground">
          {name}
        </p>

        <div className="relative rounded-2xl rounded-tl-sm bg-secondary p-4 text-secondary-foreground">
          <ReactMarkdown className="prose max-w-none dark:prose-invert">
            {message}
          </ReactMarkdown>
          {typeof onReact !== "undefined" && (
            <div className="absolute -bottom-4 right-4 mt-2 space-x-2">
              <Button
                size="icon"
                variant={reaction === "LIKE" ? "default" : "outline"}
                className="h-8 w-8"
                onClick={() => onReact?.("LIKE")}
              >
                <p className="sr-only">Like</p>
                <ThumbsUp size={16} />
              </Button>
              <Button
                size="icon"
                variant={reaction === "DISLIKE" ? "default" : "outline"}
                className="h-8 w-8"
                onClick={() => onReact?.("DISLIKE")}
              >
                <p className="sr-only">Dislike</p>
                <ThumbsDown size={16} />
              </Button>
            </div>
          )}
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
    </div>
  );
};

export default BotMessageBubble;
