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
import { updateQuickPromptValidator, UpdateQuickPromptDto } from "@acme/core";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { QuickPrompt } from "@acme/db";
import { APP_NAME } from "@/utils/constants";
import { Checkbox } from "../ui/checkbox";
import { trpc } from "@/utils/trpc";

const UpdateQuickPromptModal = ({
  onOpenChange,
  open,
  prompt,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  prompt: QuickPrompt;
}) => {
  const form = useForm<UpdateQuickPromptDto>({
    resolver: zodResolver(updateQuickPromptValidator),
    values: {
      id: prompt.id,
      title: prompt.title,
      prompt: prompt.prompt,
      isFollowUpPrompt: prompt.isFollowUpPrompt,
    },
  });

  const { toast } = useToast();
  const utils = trpc.useContext();

  const updateQuickPrompt = trpc.quickPrompt.update.useMutation({
    onSuccess: (data) => {
      onOpenChange(false);
      toast({ title: `Quick prompt updated` });
      utils.quickPrompt.list.invalidate({ chatbotId: data.chatbotId });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateQuickPromptDto) =>
    updateQuickPrompt.mutate(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
      }}
    >
      <DialogContent className="flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Update Quick Prompt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <input type="text" {...form.register("id")} readOnly hidden />

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
              <Button type="submit" disabled={updateQuickPrompt.isLoading}>
                {updateQuickPrompt.isLoading && (
                  <Loader2
                    size={18}
                    className="-ml-1 mr-2 h-4 w-4 animate-spin"
                  />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateQuickPromptModal;
