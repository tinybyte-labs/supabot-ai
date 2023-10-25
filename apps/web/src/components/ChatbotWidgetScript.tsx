import { BASE_DOMAIN } from "@/utils/constants";
import Script from "next/script";

const ChatbotWidgetScript = () => {
  return (
    <Script
      async
      strategy="lazyOnload"
      src={`${BASE_DOMAIN}/widgets/chatbox.js?id=${process.env.NEXT_PUBLIC_CHATBOT_ID}`}
    ></Script>
  );
};

export default ChatbotWidgetScript;
