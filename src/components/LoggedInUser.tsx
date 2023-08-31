import { Button } from "@/components/ui/button";
import { Check, LogOut, UserPlus, User, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useSession,
  useSessionList,
} from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LoggedInUser = () => {
  const { isLoaded: sessionLoaded, session: activeSession } = useSession();
  const {
    isLoaded: sessionsLoaded,
    sessions,
    setActive: setActiveSession,
  } = useSessionList();
  const { isLoaded: orgLoaded, organization: activeOrg } = useOrganization();
  const {
    isLoaded: orgsLoaded,
    organizationList,
    setActive: setActiveOrg,
  } = useOrganizationList();
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (
    !(
      authLoaded &&
      isSignedIn &&
      orgLoaded &&
      sessionLoaded &&
      sessionsLoaded &&
      orgsLoaded
    )
  ) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-fit flex-col items-start justify-start p-3 text-left"
          variant="ghost"
        >
          <p className="text-sm font-normal text-muted-foreground">
            Logged in as:
          </p>
          <p className="text-base font-medium">
            {activeSession?.user?.primaryEmailAddress?.emailAddress}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Accounts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sessions.map((session) => (
            <DropdownMenuItem
              key={session.user?.id}
              onClick={() => setActiveSession({ session: session.id })}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={session.user?.imageUrl} />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                {session.user?.primaryEmailAddress?.emailAddress}
              </div>
              <Check
                size={18}
                className={cn("ml-2 opacity-0", {
                  "opacity-100": activeSession?.id === session.id,
                })}
              />
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/account">
              <Settings size={18} className="mr-2" />
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/signin">
              <UserPlus size={18} className="mr-2" />
              Add Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizationList.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No organization found!
            </p>
          ) : (
            organizationList.map((org) => (
              <DropdownMenuItem
                key={org.organization.id}
                onClick={() => setActiveOrg(org)}
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={org.organization.imageUrl} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">{org.organization.name}</div>
                <Check
                  size={18}
                  className={cn("ml-2 opacity-0", {
                    "opacity-100": activeOrg?.id === org.organization.id,
                  })}
                />
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          {activeOrg && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/settings/organization">
                  <Settings size={18} className="mr-2" />
                  Organization Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/organization#/invite-members">
                  <UserPlus size={18} className="mr-2" />
                  Invite Members
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/create-org">
              <Plus size={18} className="mr-2" />
              Create Organization
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ sessionId: activeSession?.id })}
        >
          <LogOut size={18} className="mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoggedInUser;
