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
import { useOrganization } from "@/hooks/useOrganization";
import { ModalFn } from "@/types/modal";
import { trpc } from "@/utils/trpc";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const DeleteOrganizationConfirmModal: ModalFn = ({ onOpenChange, open }) => {
  const { data: org } = useOrganization();
  const form = useForm({
    defaultValues: {
      slug: "",
      verifyText: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const utils = trpc.useContext();

  const deleteOrgMutation = trpc.organization.delete.useMutation({
    onSuccess: async (data) => {
      toast({ title: "Success", description: "Organization has been deleted" });
      utils.organization.getAll.invalidate();
      utils.organization.getById.invalidate({ id: data.id });
      utils.organization.getBySlug.invalidate({ slug: data.slug });
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

  const onDelete = () => (org ? deleteOrgMutation.mutate({ id: org.id }) : {});

  if (!org) {
    return null;
  }

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
                    value !== org?.slug
                      ? "Please enter your organization name to continue"
                      : true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enter the organization slug <b>{org?.slug}</b> to
                      continue:
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
