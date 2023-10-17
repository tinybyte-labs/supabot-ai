import { defaultChatbotSettings } from "@acme/core/utils/default-chatbot-settings";
import { getHSLFromColor } from "@acme/core/utils/get-hsl-from-color";
import { ChatbotSettings } from "@acme/core/validators";

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
