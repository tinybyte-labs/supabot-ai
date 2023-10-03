import Head from "next/head";
import { APP_NAME } from "@/utils/constants";
import { NextPageWithLayout } from "@/types/next";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { CreateOrgDto, createOrgValidator } from "@acme/core";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, ButtonLoader } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

const CreateOrgPage: NextPageWithLayout = () => {
  const form = useForm<CreateOrgDto>({
    resolver: zodResolver(createOrgValidator),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const createOrgMutation = trpc.organization.create.useMutation();

  const onSubmit = (data: CreateOrgDto) => createOrgMutation.mutate(data);

  return (
    <>
      <Head>
        <title>{`Create Org - ${APP_NAME}`}</title>
      </Head>

      <div className="mx-auto w-fit py-16">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="My Org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="my-org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={createOrgMutation.isLoading}>
                {createOrgMutation.isLoading && <ButtonLoader />}
                Send
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

CreateOrgPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default CreateOrgPage;
