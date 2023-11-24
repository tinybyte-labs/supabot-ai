import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import AccountSettingsLayout from "@/layouts/AccountSettingsLayout";
import { NextPageWithLayout } from "@/types/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { APP_NAME } from "@/utils/constants";

const AccountSettings: NextPageWithLayout = () => {
  return (
    <div>
      <UpdateNameFrom />
    </div>
  );
};

AccountSettings.getLayout = (page) => (
  <AccountSettingsLayout>{page}</AccountSettingsLayout>
);

export default AccountSettings;

const updateProfileSchema = z.object({
  name: z.string().max(100).optional(),
});
type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

const UpdateNameFrom = () => {
  const { data: session, status, update } = useSession();
  const form = useForm<UpdateProfileDto>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: "",
    },
  });
  const { toast } = useToast();
  const updateUser = trpc.user.updateUser.useMutation();

  const handleSubmit = useCallback(
    async (data: UpdateProfileDto) => {
      try {
        await updateUser.mutateAsync({ name: data.name });
        await update();
        toast({ title: "Success", description: "User details updated" });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message ?? "Something went wrong!",
          variant: "destructive",
        });
        console.log(err);
      }
    },
    [toast, update, updateUser],
  );

  useEffect(() => {
    if (status === "authenticated") {
      form.setValue("name", session.user.name ?? "");
    }
  }, [form, session?.user.name, status]);

  if (status !== "authenticated") {
    return <Skeleton className="h-64" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your {APP_NAME} profile</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2Icon
                  size={18}
                  className="-ml-1 mr-2 h-4 w-4 animate-spin"
                />
              )}
              Update
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
