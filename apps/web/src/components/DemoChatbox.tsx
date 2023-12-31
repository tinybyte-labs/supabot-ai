import { cn } from "@/lib/utils";
import { WIDGETS_BASE_URL } from "@/utils/constants";

const DemoChatbox = ({ className }: { className?: string }) => {
  if (!process.env.NEXT_PUBLIC_CHATBOT_ID) {
    return <p>No demo chatbot id found in env!</p>;
  }

  return (
    <iframe
      src={`${WIDGETS_BASE_URL}/c/${process.env.NEXT_PUBLIC_CHATBOT_ID}`}
      className={cn(
        "mx-auto h-[620px] w-[420px] max-w-[calc(100vw-2rem)] rounded-3xl border-8 border-white/10 shadow-2xl ring-1 ring-white/30 md:h-[720px]",
        className,
      )}
      loading="lazy"
      title="Demo Chatbox"
    ></iframe>
  );
};

export default DemoChatbox;
