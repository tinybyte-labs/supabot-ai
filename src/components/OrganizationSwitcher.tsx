import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLabel,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useAuth,
  useOrganization,
  useSession,
  useSessionList,
} from "@clerk/nextjs";
import {
  Check,
  ChevronsUpDown,
  LogOut,
  Plus,
  Settings,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

const OrganizationSwitcher = ({ className }: { className?: string }) => {
  const { isLoaded: sessionLoaded, session: activeSession } = useSession();
  const { isLoaded: sessionsLoaded, sessions, setActive } = useSessionList();
  const { isLoaded: orgLoaded, organization: activeOrg } = useOrganization();
  const { isLoaded: authLoaded, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (
    !(activeOrg && authLoaded && orgLoaded && sessionLoaded && sessionsLoaded)
  ) {
    return <Skeleton className={cn("h-10 min-w-[180px]", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("justify-start text-left", className)}
        >
          <Avatar className="-ml-1 mr-2 h-6 w-6">
            {activeOrg.imageUrl && <AvatarImage src={activeOrg.imageUrl} />}
            <AvatarFallback className="uppercase">
              {activeOrg.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">{activeOrg.name}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandEmpty>No organization found.</CommandEmpty>
          {sessions.map((session) => (
            <CommandGroup key={session.id}>
              <CommandLabel>
                {session.user?.primaryEmailAddress?.emailAddress}
              </CommandLabel>
              {session.user?.organizationMemberships.map((org) => (
                <CommandItem
                  key={org.organization.id}
                  value={`${session.user?.primaryEmailAddress?.emailAddress}-${org.organization.slug}`}
                  onSelect={() => {
                    setActive({
                      session: session.id,
                      organization: org.organization.id,
                    });
                    setOpen(false);
                    router.reload();
                  }}
                >
                  <Avatar className="mr-2 h-6 w-6">
                    {org.organization?.imageUrl && (
                      <AvatarImage src={org.organization.imageUrl} />
                    )}
                    <AvatarFallback className="uppercase">
                      {org.organization?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">{org.organization.name}</div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      session.user?.id === activeSession?.user.id &&
                        org.organization.id === activeOrg.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                router.push("/settings/organization");
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Organization Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/settings/organization#/invite-members");
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                router.push("/create-org");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/signin");
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Account
            </CommandItem>
            <CommandItem
              onSelect={() => {
                signOut({ sessionId: activeSession?.id });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OrganizationSwitcher;
