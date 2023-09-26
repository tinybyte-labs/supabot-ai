import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";

const ThemeTogglerIconButton = () => {
  const { theme, setTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <Skeleton className="h-10 w-10" />;
  }

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
