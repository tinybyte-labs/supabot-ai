import { ModalFn } from "@/types/modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import {
  CreateChatbotDto,
  createChatbotValidator,
} from "@acme/core/validators";

const CreateChatbotModal: ModalFn = ({ onOpenChange, open }) => {
  const router = useRouter();
  const { isSuccess: isOrgLoaded, data: currentOrg } = useOrganization();
  const form = useForm<CreateChatbotDto>({
    resolver: zodResolver(createChatbotValidator),
    defaultValues: {
      name: "",
      orgSlug: "",
    },
  });

  const { toast } = useToast();
  const utils = trpc.useContext();

  const createChatbot = trpc.chatbot.createChatbot.useMutation({
    onSuccess: (data, vars) => {
      toast({ title: "Chatbot created" });
      utils.chatbot.getAllChatbotsForOrganization.invalidate({
        orgSlug: vars.orgSlug,
      });
      router.push(`/${vars.orgSlug}/chatbots/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: CreateChatbotDto) => createChatbot.mutate(data);

  useEffect(() => {
    if (isOrgLoaded) {
      form.setValue("orgSlug", currentOrg.slug);
    }
  }, [currentOrg, form, isOrgLoaded]);

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
          <DialogTitle>Create Chatbot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My bot" autoFocus {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createChatbot.isLoading}>
                {createChatbot.isLoading && (
                  <Loader2
                    size={18}
                    className="-ml-1 mr-2 h-4 w-4 animate-spin"
                  />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatbotModal;
