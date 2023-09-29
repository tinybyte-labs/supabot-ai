import type { ChatbotSettings } from "../validators";
import { defaultChatbotSettings } from "./default-chatbot-settings";
import { getHSLFromColor } from "./get-hsl-from-color";

export const getChatbotStyle = (
  className: string,
  settings?: ChatbotSettings | null,
) => {
  const primaryColor = getHSLFromColor(
    settings?.primaryColor || defaultChatbotSettings.primaryColor || "",
  );
  const primaryForegroundColor = getHSLFromColor(
    settings?.primaryForegroundColor ||
      defaultChatbotSettings.primaryForegroundColor ||
      "",
  );
  return `.${className} {
    --primary: ${primaryColor};
    --primary-foreground: ${primaryForegroundColor};
  }`;
};
