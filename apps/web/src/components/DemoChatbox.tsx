import { cn } from "@/lib/utils";

const DemoChatbox = ({ className }: { className?: string }) => {
  if (!process.env.NEXT_PUBLIC_CHATBOT_ID) {
    return <p>No demo chatbot id found in env!</p>;
  }

  return (
    <iframe
      src={`/widgets/c/${process.env.NEXT_PUBLIC_CHATBOT_ID}`}
      className={cn(
        "mx-auto h-[620px] w-[420px] max-w-[calc(100vw-2rem)] rounded-xl border shadow-2xl md:h-[720px]",
        className,
      )}
      loading="lazy"
      title="Demo Chatbox"
    ></iframe>
  );
};

export default DemoChatbox;