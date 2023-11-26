import { useOrganization } from "@/hooks/useOrganization";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import ErrorBox from "./ErrorBox";
import { Button, ButtonLoader } from "./ui/button";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { APP_NAME } from "@/utils/constants";
import { useToast } from "./ui/use-toast";

const OrgGuard = ({ children }: { children: ReactNode }) => {
  const orgQuery = useOrganization();

  return (
    <div>
      {orgQuery.isError ? (
        <div className="flex min-h-screen items-center justify-center">
          <ErrorBox
            title="Failed to load Organization"
            description={orgQuery.error.message}
          >
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeftIcon size={18} className="-ml-1 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              disabled={orgQuery.isRefetching}
              onClick={() => orgQuery.refetch()}
            >
              {orgQuery.isRefetching ? (
                <ButtonLoader />
              ) : (
                <RefreshCwIcon size={18} className="-ml-1 mr-2" />
              )}
              Retry
            </Button>
          </ErrorBox>
          <CheckInvitation />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default OrgGuard;

const CheckInvitation = () => {
  const router = useRouter();
  const { orgSlug } = router.query as { orgSlug: string };
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const invitationQuery = trpc.members.checkInvitation.useQuery(
    { orgSlug },
    { enabled: router.isReady },
  );

  const acceptInvitation = trpc.members.acceptInvite.useMutation({
    onSuccess: (_, data) => {
      utils.invalidate();
    },
    onError: (error) => {
      toast({
        title: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  return (
    <AlertDialog open={!!invitationQuery.data}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Organization Invitation</AlertDialogTitle>
          <AlertDialogDescription>
            You have been invited to join and collaborate on the {orgSlug}{" "}
            organization on {APP_NAME}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => acceptInvitation.mutate({ orgSlug })}
            disabled={acceptInvitation.isLoading}
          >
            {acceptInvitation.isLoading && <ButtonLoader />}
            Accept Invite
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
