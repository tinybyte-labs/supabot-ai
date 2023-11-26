import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, ButtonLoader } from "@/components/ui/button";
import MembersLayout from "@/layouts/MembersLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, User2 } from "lucide-react";
import { useRouter } from "next/router";
import { OrganizationInvite } from "@acme/db";
import { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const InvitationsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const invitesQuery = trpc.members.getAllInvitesByOrgSlug.useQuery(
    { orgSlug: router.query.orgSlug as string },
    { enabled: router.isReady },
  );
  return (
    <div className="rounded-md border">
      {invitesQuery.isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : invitesQuery.isError ? (
        <div className="p-4">
          <p>{invitesQuery.error.message ?? "Something went wrong!"}</p>
          <Button
            variant="outline"
            disabled={invitesQuery.isRefetching}
            onClick={() => invitesQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : invitesQuery.data.length === 0 ? (
        <div className="p-4">
          <p className="text-muted-foreground text-sm">No Invites</p>
        </div>
      ) : (
        invitesQuery.data.map((invite) => (
          <InviteRow key={invite.email} invite={invite} />
        ))
      )}
    </div>
  );
};

InvitationsPage.getLayout = (page) => <MembersLayout>{page}</MembersLayout>;

export default InvitationsPage;

const InviteRow = ({ invite }: { invite: OrganizationInvite }) => {
  const [showRevokeAlert, setShowRevokeAlert] = useState(false);
  const router = useRouter();
  const context = trpc.useUtils();
  const { toast } = useToast();
  const revokeInviteMut = trpc.members.revokeInvitation.useMutation({
    onSuccess: (_, data) => {
      setShowRevokeAlert(false);
      context.members.getAllInvitesByOrgSlug.invalidate({
        orgSlug: data.orgSlug,
      });
      toast({ title: "Invitation revoked." });
    },
    onError: (error) => {
      toast({
        title: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  const handleRevoke = useCallback(
    () =>
      revokeInviteMut.mutate({
        email: invite.email,
        orgSlug: router.query.orgSlug as string,
      }),
    [invite.email, revokeInviteMut, router.query.orgSlug],
  );

  return (
    <div
      key={`${invite.organizationId}-${invite.email}`}
      className="flex items-center gap-4 p-4"
    >
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <p className="flex-1 truncate">{invite.email}</p>
          <p className="text-muted-foreground truncate text-sm">
            {invite.email}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Invited {formatDistanceToNow(invite.createdAt, { addSuffix: true })}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowRevokeAlert(true)}>
            Revoke invite
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showRevokeAlert} onOpenChange={setShowRevokeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
              This will revoke {invite.email}&apos;s invitation to join your
              organization. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokeInviteMut.isLoading}
            >
              {revokeInviteMut.isLoading && <ButtonLoader />}
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
