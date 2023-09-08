import { useRouter } from "next/router";

const ChatbotDemoPage = () => {
  const {
    query: { chatbotId },
  } = useRouter();
  return (
    <div className="flex h-screen items-center justify-center p-8">
      <iframe
        src={`/widgets/c/${chatbotId}`}
        className="h-full max-h-[720px] w-full max-w-[400px] overflow-hidden rounded-xl border shadow-2xl"
      ></iframe>
    </div>
  );
};

export default ChatbotDemoPage;
