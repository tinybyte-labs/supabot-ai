"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Plus, Settings, HelpCircleIcon } from "lucide-react";
import Link from "next/link";
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
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";

const LoggedInUser = () => {
  const { status, data: session } = useSession();
  const [open, setOpen] = useState(false);
  const orgListQuery = api.organization.getAll.useQuery();
  const router = useRouter();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-fit flex-col items-start justify-start p-3 text-left"
          variant="ghost"
        >
          <p className="text-muted-foreground text-sm font-normal">
            Logged in as:
          </p>
          <p className="text-base font-medium">{session.user.email}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/account">
              <Settings size={18} className="mr-2" />
              Account Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orgListQuery.isLoading ? (
            <p>Loading...</p>
          ) : orgListQuery.isError ? (
            <p>Error: {orgListQuery.error.message}</p>
          ) : orgListQuery.data.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">
              No organization found!
            </p>
          ) : (
            orgListQuery.data.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => router.push(`/${org.slug}`)}
              >
                <Avatar className="mr-2 h-6 w-6">
                  {org.image && <AvatarImage src={org.image} />}
                  <AvatarFallback className="uppercase">
                    {org.slug[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">{org.name}</div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/create-org">
              <Plus size={18} className="mr-2" />
              Create Organization
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/help">
            <HelpCircleIcon size={18} className="mr-2" />
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut size={18} className="mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoggedInUser;
