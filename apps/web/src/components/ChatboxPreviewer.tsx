import { ArrowLeft, MoreVertical, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import BotMessageBubble from "./BotMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import { APP_NAME, DOMAIN } from "@/utils/constants";
import ChatboxInputBar from "./ChatboxInputBar";
import { useState } from "react";
import ChatboxWatermark from "./ChatboxWatermark";
import { type ChatbotSettings, getHSLFromColor } from "@acme/core";
import { cn } from "@/lib/utils";
import ChatboxHeader from "./ChatboxHeader";

export type ChatboxPreviewerProps = {
  title: string;
  settings?: ChatbotSettings | null;
};
const ChatboxPreviewer = ({ title, settings }: ChatboxPreviewerProps) => {
  const [message, setMessage] = useState("");
  return (
    <div className={cn(settings?.theme || "light")}>
      <style>
        {`.chatbox-previewer {
            --primary: ${getHSLFromColor(settings?.primaryColor || "")};
            --primary-foreground: ${getHSLFromColor(
              settings?.primaryForegroundColor || "",
            )};
          }`}
      </style>
      <div
        className={cn(
          "chatbox-previewer bg-background text-foreground flex h-[640px] w-[400px] flex-col overflow-hidden rounded-xl border shadow-2xl",
        )}
        style={{
          colorScheme: settings?.theme || "light",
        }}
      >
        <ChatboxHeader
          title={title}
          leading={
            <Button size="icon" variant="ghost">
              <p className="sr-only">go to home</p>
              <ArrowLeft size={22} />
            </Button>
          }
          trailing={
            <Button size="icon" variant="ghost">
              <p className="sr-only">Menu</p>
              <MoreVertical size={22} />
            </Button>
          }
        />
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
            {typeof settings?.welcomeMessage === "string" &&
              settings.welcomeMessage.length > 0 && (
                <BotMessageBubble
                  message={settings.welcomeMessage}
                  date={new Date()}
                  theme={settings.theme}
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
              theme={settings?.theme}
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
    </div>
  );
};

export default ChatboxPreviewer;
