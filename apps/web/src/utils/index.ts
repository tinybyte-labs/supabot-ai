import { defaultChatbotSettings } from "@/data/defaultChatbotSettings";
import { getTwHSL } from "./getTwHSL";
import { ChatbotSettings } from "./validators";

export const getChatbotStyle = (
  className: string,
  settings?: ChatbotSettings | null,
) => {
  const primaryColor = getTwHSL(
    settings?.primaryColor || defaultChatbotSettings.primaryColor || "",
  );
  const primaryForegroundColor = getTwHSL(
    settings?.primaryForegroundColor ||
      defaultChatbotSettings.primaryForegroundColor ||
      "",
  );
  return `.${className} {
    --primary: ${primaryColor};
    --primary-foreground: ${primaryForegroundColor};
  }`;
};
