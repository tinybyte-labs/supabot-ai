import { CustomError } from "@/lib/response";

export const CHATBOT_NOT_FOUND_ERROR: CustomError = {
  code: "CHATBOT_NOT_FOUND",
  message: "Chatbot not found!",
};

export const INTERNAL_SERVER_ERROR: CustomError = {
  code: "INTERNAL_SERVER_ERROR",
  message: "Internal server error",
};
