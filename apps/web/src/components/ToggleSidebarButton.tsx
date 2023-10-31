import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/atoms/sidebarOpen";

const ToggleSidebarButton = () => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="-ml-2 lg:hidden"
    >
      <MenuIcon />
    </Button>
  );
};

export default ToggleSidebarButton;
