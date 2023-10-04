import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  ChevronsUpDown,
  Computer,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { ReactNode } from "react";
import { Label } from "./ui/label";
import { signOut, useSession } from "next-auth/react";

const themes: Record<string, { label: string; icon: ReactNode }> = {
  system: {
    label: "System",
    icon: <Computer size={16} />,
  },
  light: {
    label: "Light",
    icon: <Computer size={16} />,
  },
  dark: {
    label: "Dark",
    icon: <Computer size={16} />,
  },
};

const FullUserDropdownButton = () => {
  const { status, data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (status === "loading") {
    return <Skeleton className="h-[50px] w-full" />;
  }

  if (status === "unauthenticated") {
    return <p>Unauthenticated</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-fit w-full justify-start gap-2 p-2 text-left"
          variant="outline"
        >
          <Avatar className="h-8 w-8">
            {session?.user.image && <AvatarImage src={session.user.image} />}
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <p className="truncate font-medium leading-4">
              {session?.user.name || session?.user.email}
            </p>
            <p className="text-muted-foreground truncate text-sm font-normal leading-4">
              {session?.user.email}
            </p>
          </div>
          <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {session?.user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/account">
              <Settings size={18} className="mr-2" />
              Account Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between gap-2 py-1 pl-2">
          <Label htmlFor="theme-switcher" className="flex-1 truncate">
            Theme
          </Label>
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger id="theme-switcher" className="w-fit gap-2">
              {theme && (
                <>
                  {themes[theme].icon}
                  {themes[theme].label}
                </>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Links</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/home">
              <Home size={18} className="mr-2" />
              Homepage
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help">
              <HelpCircle size={18} className="mr-2" />
              Help
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut size={18} className="mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FullUserDropdownButton;
