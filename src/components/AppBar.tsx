import ToggleSidebarButton from "./ToggleSidebarButton";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import FoodbackForm from "./froms/FoodbackForm";
import { useState } from "react";
import Link from "next/link";

const AppBar = () => {
  const [feedbackPopoverOpen, setFeedbackPopoverOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background text-foreground">
      <div className="container flex h-14 max-w-none items-center justify-end gap-2">
        <ToggleSidebarButton />
        <div className="flex-1"></div>
        <Popover
          open={feedbackPopoverOpen}
          onOpenChange={setFeedbackPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              <MessageSquare size={20} className="-ml-1 mr-2" />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <FoodbackForm onSuccess={() => setFeedbackPopoverOpen(false)} />
          </PopoverContent>
        </Popover>
        <Button asChild variant="ghost">
          <Link href="/help">Help</Link>
        </Button>
      </div>
    </header>
  );
};

export default AppBar;
