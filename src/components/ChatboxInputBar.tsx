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
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-primary transition-all hover:scale-105"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <SendHorizonal size={24} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatboxInputBar;
