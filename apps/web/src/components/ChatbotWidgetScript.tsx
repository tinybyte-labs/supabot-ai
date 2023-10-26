import { BASE_URL } from "@/utils/constants";
import Script from "next/script";

const ChatbotWidgetScript = () => {
  return (
    <Script
      async
      strategy="lazyOnload"
      src={`${BASE_URL}/widgets/chatbox.js?id=${process.env.NEXT_PUBLIC_CHATBOT_ID}`}
    ></Script>
  );
};

export default ChatbotWidgetScript;
