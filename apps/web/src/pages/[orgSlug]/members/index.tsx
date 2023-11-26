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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonLoader } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import MembersLayout from "@/layouts/MembersLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import {
  OrganizationMembership,
  OrganizationMembershipRole,
  User,
} from "@acme/db";
import { Loader2, MoreVertical, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const roleLabel: Record<OrganizationMembershipRole, string> = {
  MEMBER: "Member",
  OWNER: "Owner",
};

const MembersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const membersQuery = trpc.members.getAllMembersByOrgSlug.useQuery(
    { orgSlug: router.query.orgSlug as string },
    { enabled: router.isReady },
  );
  return (
    <div className="rounded-md border">
      {membersQuery.isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : membersQuery.isError ? (
        <div className="p-4">
          <p>{membersQuery.error.message ?? "Something went wrong!"}</p>
          <Button
            variant="outline"
            disabled={membersQuery.isRefetching}
            onClick={() => membersQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : membersQuery.data.length === 0 ? (
        <div className="p-4">
          <p className="text-muted-foreground text-sm">No Members</p>
        </div>
      ) : (
        membersQuery.data.map((item) => (
          <MemberRow member={item} key={item.userId} />
        ))
      )}
    </div>
  );
};

MembersPage.getLayout = (page) => <MembersLayout>{page}</MembersLayout>;

export default MembersPage;

const MemberRow = ({
  member,
}: {
  member: OrganizationMembership & { user: User };
}) => {
  const { data: organization } = useOrganization();
  const { data: session } = useSession();
  const router = useRouter();
  const { orgSlug } = router.query as { orgSlug: string };
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const [showLeaveOrgAlert, setShowLeaveOrgAlert] = useState(false);
  const [showRemoveTeammateAlert, setShowRemoveTeammateAlert] = useState(false);
  const [changeRoleTo, setChangeRoleTo] =
    useState<OrganizationMembershipRole | null>(null);

  const removeMemberMut = trpc.members.removeMember.useMutation({
    onSuccess: () => {
      utils.organization.getBySlug.invalidate({ slug: orgSlug });
      utils.members.getAllMembersByOrgSlug.invalidate({ orgSlug });
      toast({ title: "Teammate removed" });
    },
    onError: (error) => {
      toast({
        title: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  const changeRoleMut = trpc.members.chagneMemberRole.useMutation({
    onSuccess: () => {
      utils.members.getAllMembersByOrgSlug.invalidate({ orgSlug });
      utils.organization.getBySlug.invalidate({ slug: orgSlug });
      toast({ title: "Organization member role updated successfully" });
    },
    onError: (error) => {
      toast({
        title: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <Avatar className="h-12 w-12">
          {member.user.image && <AvatarImage src={member.user.image} />}
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <p className="truncate font-medium">
            {member.user.name ?? member.user.email ?? member.user.id}
          </p>
          <p className="text-muted-foreground truncate text-sm">
            {member.user.email}
          </p>
        </div>
      </div>

      <Select
        value={member.role}
        onValueChange={(value) =>
          setChangeRoleTo(value as OrganizationMembershipRole)
        }
        disabled={changeRoleMut.isLoading}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
          {changeRoleMut.isLoading && <Loader2 className="ml-2 animate-spin" />}
        </SelectTrigger>
        <SelectContent>
          {(["OWNER", "MEMBER"] satisfies OrganizationMembershipRole[]).map(
            (role) => (
              <SelectItem key={role} value={role}>
                {roleLabel[role]}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={removeMemberMut.isLoading}
          >
            {removeMemberMut.isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MoreVertical />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {member.userId === session?.user.id ? (
            <DropdownMenuItem onClick={() => setShowLeaveOrgAlert(true)}>
              Leave Organization
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowRemoveTeammateAlert(true)}>
              Remove Teammate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={showRemoveTeammateAlert}
        onOpenChange={setShowRemoveTeammateAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teammate</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              {member.user.name ?? member.user.email ?? member.userId} from this
              organization. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMemberMut.isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                removeMemberMut.mutate({ orgSlug, userId: member.userId })
              }
              disabled={removeMemberMut.isLoading}
              variant="destructive"
            >
              {removeMemberMut.isLoading && <ButtonLoader />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLeaveOrgAlert} onOpenChange={setShowLeaveOrgAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Organization</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re about to leave {orgSlug}. You will lose all access to
              this organization. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMemberMut.isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                removeMemberMut.mutate({ orgSlug, userId: member.userId })
              }
              disabled={removeMemberMut.isLoading}
              variant="destructive"
            >
              {removeMemberMut.isLoading && <ButtonLoader />}
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!changeRoleTo}
        onOpenChange={(open) => {
          if (!open) {
            setChangeRoleTo(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              This will change{" "}
              {member.user.name ?? member.user.email ?? member.userId}
              &apos;s role in {orgSlug} to {roleLabel[changeRoleTo!]}.
              {changeRoleTo === "OWNER" &&
                " And, the current Owner will be downgraded to Member."}{" "}
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={changeRoleMut.isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                changeRoleMut.mutate({
                  orgSlug,
                  role: changeRoleTo!,
                  userId: member.userId,
                })
              }
              disabled={changeRoleMut.isLoading}
            >
              {changeRoleMut.isLoading && <ButtonLoader />}
              Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
