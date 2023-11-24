"use client";

import { Button, ButtonLoader } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ModalFn } from "@/types/modal";
import { trpc } from "@/utils/trpc";
import { DialogClose } from "@radix-ui/react-dialog";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

const DeleteUserConfirmModal: ModalFn = ({ onOpenChange, open }) => {
  const { data: session } = useSession();
  const form = useForm({
    defaultValues: {
      email: "",
      verifyText: "",
    },
  });
  const { toast } = useToast();

  const deleteUserMutation = trpc.user.deleteUser.useMutation();

  const onDelete = useCallback(async () => {
    try {
      await deleteUserMutation.mutateAsync();
      await signOut();
      toast({ title: "Success", description: "User deleted" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong!",
        variant: "destructive",
      });
    }
  }, [deleteUserMutation, toast]);

  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Warning: This will permanently delete your account and this action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDelete)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  validate: (value) =>
                    value !== session?.user.email
                      ? "Please enter your email to continue"
                      : true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter your email <b>{session.user.email}</b> to continue:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="verifyText"
                rules={{
                  validate: (value) =>
                    value !== "delete my account"
                      ? "Please enter the requested value to continue"
                      : true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To verifiy, type <b>delete my account</b> below:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <Button asChild variant="secondary">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={deleteUserMutation.isLoading}
              >
                {deleteUserMutation.isLoading && <ButtonLoader />}
                Delete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserConfirmModal;
