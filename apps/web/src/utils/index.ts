import { defaultChatbotSettings } from "@/data/defaultChatbotSettings";
import { type ChatbotSettings, getHSLFromColor } from "@acme/core";

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
