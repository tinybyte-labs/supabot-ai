import ToggleSidebarButton from "./ToggleSidebarButton";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

const AppBar = () => {
  return (
    <header className="sticky top-0 z-30 border-b bg-background text-foreground">
      <div className="container flex h-14 max-w-none items-center justify-end gap-4">
        <ToggleSidebarButton />
        <div className="flex-1"></div>
        <Button variant="outline">
          <MessageSquare size={20} className="-ml-1 mr-2" />
          Feedback
        </Button>
      </div>
    </header>
  );
};

export default AppBar;
