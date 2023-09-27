import { useAuth, useSession } from "@clerk/nextjs";
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
  ExternalLink,
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
  const { isLoaded, session } = useSession();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!(isLoaded && session)) {
    return <Skeleton className="h-[50px] w-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-fit w-full justify-start gap-2 p-2 text-left"
          variant="outline"
        >
          <Avatar className="h-8 w-8">
            {session.user.imageUrl && (
              <AvatarImage src={session.user.imageUrl} />
            )}
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <p className="truncate font-medium leading-4">
              {session.user.fullName ||
                session.user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="truncate text-sm font-normal leading-4 text-muted-foreground">
              {session.user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {session.user.primaryEmailAddress?.emailAddress}
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
            <Link href="/chatbots">
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

        <DropdownMenuItem onClick={() => signOut({ sessionId: session?.id })}>
          <LogOut size={18} className="mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FullUserDropdownButton;