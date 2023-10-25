import { Message } from "@acme/db";

export default function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1 px-4">
      <p className="text-right text-sm text-slate-400">
        {message.createdAt.toLocaleTimeString()}
      </p>
      <div className="pl-8">
        <div className="rounded-xl rounded-tr-sm bg-[var(--primary-bg)] p-4 text-[var(--primary-fg)]">
          <p className="leading-normal">{message.body}</p>
        </div>
      </div>
    </div>
  );
}
