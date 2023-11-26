import { ModalFn } from "@/types/modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button, ButtonLoader } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";

const schema = z.object({
  email: z.string().email(),
});

type InvitePeopleForm = z.infer<typeof schema>;

const InvitePeopleModal: ModalFn = ({ onOpenChange, open }) => {
  const router = useRouter();
  const form = useForm<InvitePeopleForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useToast();
  const context = trpc.useUtils();
  const inviteMut = trpc.members.inviteTeammate.useMutation({
    onSuccess: (_, data) => {
      toast({ title: "Invitation sent." });
      onOpenChange(false);
      context.members.getAllInvitesByOrgSlug.invalidate({
        orgSlug: data.orgSlug,
      });
    },
    onError: (error) => {
      toast({
        title: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = useCallback(
    async (data: InvitePeopleForm) =>
      inviteMut.mutate({
        orgSlug: router.query.orgSlug as string,
        email: data.email,
      }),
    [inviteMut, router.query.orgSlug],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Invite a teammate to join your organization. Invitations will be
            valid for 14 days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={inviteMut.isLoading}>
                {inviteMut.isLoading && <ButtonLoader />}
                Send Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
