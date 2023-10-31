import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ComputerIcon, MoonIcon, SunIcon } from "lucide-react";
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
        <SunIcon size={20} />
      ) : theme === "dark" ? (
        <MoonIcon size={20} />
      ) : (
        <ComputerIcon size={20} />
      )}
    </Button>
  );
};

export default ThemeTogglerIconButton;
