import { BASE_URL } from "@/utils/constants";
import { useRouter } from "next/router";
import Script from "next/script";

const ChatbotDemoPage = () => {
  const {
    query: { chatbotId },
    isReady,
  } = useRouter();
  if (!isReady) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`${BASE_URL}/widgets/chatbox.js?id=${chatbotId}`}
      ></Script>
    </>
  );
};

export default ChatbotDemoPage;
