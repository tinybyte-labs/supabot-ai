import { ModalFn } from "@/types/modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useChatbot } from "@/providers/ChatbotProvider";
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
import { CreateQuickPromptDto, createQuickPromptValidator } from "@acme/core";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import { APP_NAME } from "@/utils/constants";
import { Checkbox } from "../ui/checkbox";
import { trpc } from "@/utils/trpc";

const AddQuickPromptModal: ModalFn = ({ onOpenChange, open }) => {
  const { isLoaded, chatbot } = useChatbot();
  const form = useForm<CreateQuickPromptDto>({
    resolver: zodResolver(createQuickPromptValidator),
    defaultValues: {
      chatbotId: "",
      prompt: "",
      title: "",
      isFollowUpPrompt: false,
    },
  });

  const { toast } = useToast();
  const utils = trpc.useContext();

  const addQuickPrompt = trpc.quickPrompt.create.useMutation({
    onSuccess: (data) => {
      onOpenChange(false);
      toast({ title: `Quick prompt added` });
      utils.quickPrompt.list.invalidate({ chatbotId: data.chatbotId });
    },
    onError: (error) => {
      toast({
        title: "Failed to add links",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateQuickPromptDto) =>
    addQuickPrompt.mutate(data);

  useEffect(() => {
    if (chatbot?.id) {
      form.setValue("chatbotId", chatbot.id);
    }
  }, [chatbot, form]);

  if (!(isLoaded && chatbot)) {
    return null;
  }

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
          <DialogTitle>Add Quick Prompt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <input
              type="text"
              {...form.register("chatbotId")}
              readOnly
              hidden
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Pricing Plans" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Give me a breakdown of all of the ${APP_NAME} pricing plans in a table format with monthly and yearly prices.`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFollowUpPrompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        onCheckedChange={(value) =>
                          form.setValue("isFollowUpPrompt", value === true)
                        }
                      />
                    </FormControl>
                    <FormLabel>Follow-up prompt</FormLabel>
                  </div>
                  <FormDescription>
                    Follow-up prompts will be displayed after the first AI
                    response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={addQuickPrompt.isLoading}>
                {addQuickPrompt.isLoading && (
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

export default AddQuickPromptModal;
