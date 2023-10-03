import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { ArrowRight, Check, ChevronsUpDown, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import PlanBadge from "./PlanBadge";
import { signOut } from "next-auth/react";
import { trpc } from "@/utils/trpc";

const OrganizationSwitcher = ({ className }: { className?: string }) => {
  const { isLoading, organization: currentOrg, plan } = useOrganization();
  const orgListQuery = trpc.organization.getAll.useQuery();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className={cn("h-10 min-w-[180px]", className)} />;
  }

  if (!currentOrg) {
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
            {currentOrg.image && <AvatarImage src={currentOrg.image} />}
            <AvatarFallback className="uppercase">
              {currentOrg.slug[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">{currentOrg.name}</div>
          <PlanBadge plan={plan} />
          <ChevronsUpDown size={18} className="-mr-1 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandEmpty>No organization found.</CommandEmpty>
          <CommandGroup>
            {orgListQuery.isLoading ? (
              <p>Loading...</p>
            ) : orgListQuery.isError ? (
              <p>Error: {orgListQuery.error.message}</p>
            ) : (
              orgListQuery.data.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.slug}
                  onSelect={() => {
                    router.push(`/${org.slug}`);
                    setOpen(false);
                  }}
                >
                  <Avatar className="mr-2 h-6 w-6">
                    {org.image && <AvatarImage src={org.image} />}
                    <AvatarFallback className="uppercase">
                      {org.slug[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">{org.name}</div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      org.slug === currentOrg.slug
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))
            )}
          </CommandGroup>
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OrganizationSwitcher;
