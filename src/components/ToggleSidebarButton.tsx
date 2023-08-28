import { Menu } from "lucide-react";
import React from "react";
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
      <Menu />
    </Button>
  );
};

export default ToggleSidebarButton;
