import { getTwHSL } from "@/utils/getTwHSL";
import { ChatbotSettings } from "@/utils/validators";

const ChatboxStyle = ({
  primaryColor,
  primaryForegroundColor,
}: ChatbotSettings) => {
  return (
    <style>
      {`
    .chatbox {
      ${
        typeof primaryColor === "string" && primaryColor.length > 0
          ? `--primary: ${getTwHSL(primaryColor)};`
          : ""
      }
      ${
        typeof primaryForegroundColor === "string" &&
        primaryForegroundColor.length > 0
          ? `--primary-foreground: ${getTwHSL(primaryForegroundColor)};`
          : ""
      }
    }
    `}
    </style>
  );
};

export default ChatboxStyle;
