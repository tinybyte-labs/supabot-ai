import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CreateOrganization,
  useAuth,
  useSessionList,
  useUser,
} from "@clerk/nextjs";
import { Check, LogOut, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";

const CreateOrgPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <header className="flex items-center justify-between p-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ChevronLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex-1"></div>
        <LoggedInUser />
      </header>
      <div className="mx-auto w-fit py-16">
        <CreateOrganization />
      </div>
    </>
  );
};

export default CreateOrgPage;

const LoggedInUser = () => {
  const { isLoaded, user } = useUser();
  const { sessions, isLoaded: sessionsLoaded, setActive } = useSessionList();
  const { isLoaded: authLoaded, signOut, sessionId } = useAuth();

  if (!isLoaded || !authLoaded || !sessionsLoaded) {
    return <Skeleton className="W-32 h-20" />;
  }
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-fit flex-col items-start justify-start p-3 text-left"
          variant="ghost"
        >
          <p className="text-sm font-normal text-muted-foreground">
            Logged in as:
          </p>
          <p className="text-base font-medium">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sessions.map((session) => (
          <DropdownMenuItem
            key={session.id}
            onClick={() =>
              setActive({
                session: session.id,
              })
            }
          >
            <div className="flex-1 truncate">
              {session.user?.primaryEmailAddress?.emailAddress}
            </div>
            <Check
              className={cn("ml-2 h-4 w-4 opacity-0", {
                "opacity-100": session.id === sessionId,
              })}
            />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signin">
            <UserPlus className="mr-2 h-4 w-4" />
            Add account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
