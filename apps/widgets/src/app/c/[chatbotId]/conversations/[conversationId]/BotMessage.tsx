import Image from "next/image";
import { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function BotMessage({
  avatar,
  children,
  date,
  messageId,
  name,
  sources,
}: {
  children: ReactNode | string;
  name: string;
  avatar?: string;
  date?: Date;
  messageId?: string;
  sources?: string[];
}) {
  return (
    <div className="flex w-full items-start gap-2 overflow-hidden px-4">
      <div className="h-8 w-8 overflow-hidden rounded-md bg-slate-200">
        <Image
          src={avatar ?? "/images/bot-avatar.png"}
          width={128}
          height={128}
          alt="Bot Avatar"
          className="h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1 overflow-hidden">
        <p className="text-sm text-slate-400">
          {name}
          {date ? ` • ${date.toLocaleTimeString()}` : ``}
        </p>
        <div className="flex items-start gap-2">
          <div className="rounded-xl rounded-tl-sm bg-slate-100">
            <div className="p-4">
              {typeof children === "string" ? (
                <ReactMarkdown
                  className="prose max-w-full overflow-auto"
                  remarkPlugins={[remarkGfm]}
                  linkTarget="_blank"
                >
                  {children}
                </ReactMarkdown>
              ) : (
                children
              )}
            </div>
          </div>
          <div className="w-10 flex-shrink-0">
            {messageId && (
              <button className="flex-shrink-0 text-slate-400">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {!!sources && sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Learn more:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <Link
                  href={source}
                  key={source}
                  target="_blank"
                  className="flex h-6 items-center rounded-md bg-slate-200 px-2 text-sm font-medium hover:underline"
                >
                  {source.replace("https://", "")}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
