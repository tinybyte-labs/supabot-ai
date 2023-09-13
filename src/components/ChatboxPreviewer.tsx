import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import BotMessageBubble from "./BotMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import { APP_NAME, DOMAIN } from "@/utils/constants";
import ChatboxInputBar from "./ChatboxInputBar";
import { useState } from "react";
import ChatboxWatermark from "./ChatboxWatermark";
import ChatboxStyle from "./ChatboxStyle";
import ThemeTogglerIconButton from "./ThemeTogglerIconButton";
import { ChatbotSettings } from "@/utils/validators";

export type ChatboxPreviewerProps = {
  title: string;
  settings?: ChatbotSettings | null;
};
const ChatboxPreviewer = ({ title, settings }: ChatboxPreviewerProps) => {
  const [message, setMessage] = useState("");
  return (
    <>
      <ChatboxStyle {...settings} />
      <div className="chatbox flex h-[640px] w-[400px] flex-col overflow-hidden rounded-xl border bg-background text-foreground shadow-2xl">
        <header className="flex items-center gap-3 border-b p-2">
          <Button size="icon" variant="ghost">
            <p className="sr-only">go to home</p>
            <ArrowLeft size={20} />
          </Button>

          <h1 className="text-lg font-semibold">{title}</h1>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Button size="icon" variant="ghost">
              <p className="sr-only">Refresh Conversation</p>
              <RefreshCw size={20} />
            </Button>
            <ThemeTogglerIconButton />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
            {typeof settings?.welcomeMessage === "string" &&
              settings.welcomeMessage.length > 0 && (
                <BotMessageBubble
                  message={settings.welcomeMessage}
                  date={new Date()}
                />
              )}
            <UserMessageBubble
              message={`What is ${APP_NAME}?`}
              date={new Date()}
            />
            <BotMessageBubble
              message={`${APP_NAME} is an AI chatbot platform that allows users to create personalized chatbots for their websites. It uses ChatGPT to tailor the chatbot's responses to the specific content of the website, enhancing the customer experience.`}
              date={new Date()}
              onReact={() => {}}
              reaction="LIKE"
              sources={[`https://${DOMAIN}`]}
            />
          </div>
        </div>

        <ChatboxInputBar
          value={message}
          onChange={setMessage}
          placeholderText={settings?.placeholderText || undefined}
        />
        <ChatboxWatermark />
      </div>
    </>
  );
};

export default ChatboxPreviewer;
