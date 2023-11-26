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
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

const DeleteOrganizationConfirmModal: ModalFn = ({ onOpenChange, open }) => {
  const form = useForm({
    defaultValues: {
      slug: "",
      verifyText: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const utils = trpc.useUtils();
  const orgSlug = router.query.orgSlug as string;

  const deleteOrgMutation = trpc.organization.delete.useMutation({
    onSuccess: async () => {
      toast({ title: "Success", description: "Organization has been deleted" });
      utils.organization.getAll.invalidate();
      router.push("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDelete = useCallback(
    () => deleteOrgMutation.mutate({ orgSlug }),
    [deleteOrgMutation, orgSlug],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Organization</DialogTitle>
          <DialogDescription>
            Warning: This action is not reversible. Please be certain.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDelete)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="slug"
                rules={{
                  validate: (value) =>
                    value !== orgSlug
                      ? "Please enter your organization name to continue"
                      : true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter the organization slug <b>{orgSlug}</b> to continue:
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
                    value !== "delete my organization"
                      ? "Please enter the requested value to continue"
                      : true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To verifiy, type <b>delete my organization</b> below:
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
                disabled={deleteOrgMutation.isLoading}
              >
                {deleteOrgMutation.isLoading && <ButtonLoader />}
                Delete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrganizationConfirmModal;
