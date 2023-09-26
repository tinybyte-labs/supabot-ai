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
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";
import { useAuth, useSession, useSessionList } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  LogOut,
  Plus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import PlanBadge from "./PlanBadge";

const OrganizationSwitcher = ({ className }: { className?: string }) => {
  const { isLoaded: sessionLoaded, session: activeSession } = useSession();
  const { isLoaded: sessionsLoaded, sessions, setActive } = useSessionList();
  const { isLoading, organizaton, plan } = useOrganization();
  const { isLoaded: authLoaded, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOrgChange = async ({
    sessionId,
    orgId,
  }: {
    sessionId: string;
    orgId: string;
  }) => {
    if (!sessionsLoaded) return;
    await setActive({
      session: sessionId,
      organization: orgId,
    });
    setOpen(false);
    router.reload();
  };

  if (!(authLoaded && !isLoading && sessionLoaded && sessionsLoaded)) {
    return <Skeleton className={cn("h-10 min-w-[180px]", className)} />;
  }

  if (!organizaton) {
    return (
      <Button asChild className="w-full text-left" variant="outline">
        <Link href={`/create-org`}>
          <div className="flex-1">Select Org</div>
          <ArrowRight size={20} />
        </Link>
      </Button>
    );
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
            {organizaton.imageUrl && <AvatarImage src={organizaton.imageUrl} />}
            <AvatarFallback className="uppercase">
              {organizaton.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">{organizaton.name}</div>
          <PlanBadge plan={plan} />
          <ChevronsUpDown size={18} className="-mr-1 ml-2 opacity-50" />
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
                  onSelect={() =>
                    handleOrgChange({
                      sessionId: session.id,
                      orgId: org.organization.id,
                    })
                  }
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
                        org.organization.id === organizaton.id
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
                router.push("/create-org");
                setOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/signin");
                setOpen(false);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Account
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                signOut({ sessionId: activeSession?.id });
                setOpen(false);
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
