import React from "react";
import { Button } from "./ui/button";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeTogglerIconButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        setTheme(
          theme === "light" ? "dark" : theme === "dark" ? "system" : "light",
        )
      }
    >
      <p className="sr-only">Theme Switcher</p>
      {theme === "light" ? (
        <Sun size={20} />
      ) : theme === "dark" ? (
        <Moon size={20} />
      ) : (
        <Computer size={20} />
      )}
    </Button>
  );
};

export default ThemeTogglerIconButton;
