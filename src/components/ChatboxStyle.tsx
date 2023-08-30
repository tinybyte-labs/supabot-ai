import { ChatbotSettings } from "@/types/chatbot-settings";
import { getTwHSL } from "@/utils/getTwHSL";

const ChatboxStyle = ({ primaryBgColor, primaryFgColor }: ChatbotSettings) => {
  return (
    <style>
      {`
    .chatbox {
      ${
        typeof primaryBgColor === "string" && primaryBgColor.length > 0
          ? `--primary: ${getTwHSL(primaryBgColor)};`
          : ""
      }
      ${
        typeof primaryFgColor === "string" && primaryFgColor.length > 0
          ? `--primary-foreground: ${getTwHSL(primaryFgColor)};`
          : ""
      }
    }
    `}
    </style>
  );
};

export default ChatboxStyle;
