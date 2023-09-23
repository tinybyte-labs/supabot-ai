import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const CloseChatboxButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            window.parent.postMessage("CLOSE_CHATBOX");
          }}
        >
          <div className="sr-only">Minimize Chatbox</div>
          <X size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Minimize Chatbox</TooltipContent>
    </Tooltip>
  );
};

export default CloseChatboxButton;
