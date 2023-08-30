import { Button } from "./ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

const ChatboxInputBar = ({
  placeholderText,
  value,
  onChange,
  onSubmit,
  isLoading,
  autoFocus,
}: {
  placeholderText?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}) => {
  return (
    <div className="border-t bg-card text-card-foreground backdrop-blur-lg">
      <form
        className="flex items-center gap-2 p-0"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(value);
        }}
      >
        <TextareaAutosize
          className="flex-1 resize-none bg-transparent p-4 outline-none"
          autoFocus={autoFocus}
          placeholder={placeholderText || "Ask me anything..."}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          minRows={1}
          maxRows={5}
          onKeyDown={(e) => {
            if (e.code === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit?.(value);
            }
          }}
        />
        <div className="flex items-center pr-2">
          <Button disabled={isLoading} size="icon" variant="ghost">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizonal className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatboxInputBar;
