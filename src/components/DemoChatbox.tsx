import { cn } from "@/lib/utils";

const DemoChatbox = ({ className }: { className?: string }) => {
  if (!process.env.NEXT_PUBLIC_DEMO_CHATBOT_ID) {
    return <p>No demo chatbot id found in env!</p>;
  }

  return (
    <iframe
      src={`/widgets/c/${process.env.NEXT_PUBLIC_DEMO_CHATBOT_ID}`}
      className={cn(
        "mx-auto h-[720px] w-[420px] max-w-[calc(100vw-4rem)] rounded-xl border shadow-2xl",
        className,
      )}
      loading="lazy"
    ></iframe>
  );
};

export default DemoChatbox;
