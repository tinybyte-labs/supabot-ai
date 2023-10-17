import DashboardPageHeader from "@/components/DashboardPageHeader";
import DeleteOrganizationConfirmModal from "@/components/modals/DeleteOrganizationConfirmModal";
import { useModal } from "@/components/modals/useModal";
import { Button, ButtonLoader } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { DOMAIN } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { UpdateOrgDto, updateOrgValidator } from "@acme/core/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const OrganizationSettingsPage: NextPageWithLayout = () => {
  const { isSuccess } = useOrganization();

  return (
    <>
      <DashboardPageHeader title="Settings" />
      <main className="container space-y-8">
        {isSuccess ? (
          <>
            <GeneralSettingsCard />
            <DeleteOrgCard />
          </>
        ) : (
          <>
            <Skeleton className="h-[386px]" />
            <Skeleton className="h-[184px]" />
          </>
        )}
      </main>
    </>
  );
};

OrganizationSettingsPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default OrganizationSettingsPage;

const GeneralSettingsCard = () => {
  const { data: org } = useOrganization();
  const form = useForm<UpdateOrgDto>({
    resolver: zodResolver(updateOrgValidator),
    defaultValues: {
      id: "",
      name: "",
      slug: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();
  const utils = trpc.useContext();

  const updateMutation = trpc.organization.update.useMutation({
    onSuccess: (data, vars) => {
      if (vars.slug) {
        router.push({
          pathname: router.pathname,
          query: {
            orgSlug: data.slug,
          },
        });
      }
      utils.invalidate();
      toast({ title: "Success", description: "Organization updated" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const onSubmit = (data: UpdateOrgDto) => updateMutation.mutate(data);

  useEffect(() => {
    if (org && form.getValues("id") !== org.id) {
      form.setValue("id", org.id);
      form.setValue("name", org.name);
      form.setValue("slug", org.slug);
    }
  }, [form, org]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Org" {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Slug</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="bg-muted text-muted-foreground flex items-center rounded-l-md border-y border-l px-2 text-sm">
                        <p>{DOMAIN}/</p>
                      </div>
                      <Input
                        placeholder="my-org"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" aria-disabled={updateMutation.isLoading}>
              {updateMutation.isLoading && <ButtonLoader />}
              Update
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const DeleteOrgCard = () => {
  const [Modal, { openModal }] = useModal(DeleteOrganizationConfirmModal);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Organization</CardTitle>
        <CardDescription>
          If you want to permanently delete this workspace and all of its data,
          including but not limited to users and chatbots, you can do so below.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={openModal}>
          Delete this Organization
        </Button>
      </CardFooter>
      <Modal />
    </Card>
  );
};
