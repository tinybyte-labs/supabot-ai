import { BASE_DOMAIN } from "@/utils/constants";
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted"></main>
      <Script
        strategy="lazyOnload"
        src={`${BASE_DOMAIN}/api/widget/js?id=${chatbotId}`}
      ></Script>
    </>
  );
};

export default ChatbotDemoPage;
