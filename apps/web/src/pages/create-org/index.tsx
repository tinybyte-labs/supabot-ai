import Head from "next/head";
import { APP_NAME, DOMAIN, INVALID_ORG_SLUGS } from "@/utils/constants";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, ButtonLoader } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import slugify from "slugify";

const CreateOrgPage: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CreateOrgDto>({
    resolver: zodResolver(createOrgValidator),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const name = form.watch("name");

  const createOrgMutation = trpc.organization.create.useMutation({
    onSuccess: (data) => {
      router.push(`/${data.slug}`);
      toast({ title: "Organization created" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateOrgDto) => {
    if (INVALID_ORG_SLUGS.has(data.slug)) {
      const errorMsg = "The slug is invalid. Please try using another slug.";
      toast({
        title: "Invalid slug",
        description: errorMsg,
        variant: "destructive",
      });
      form.setError("slug", { message: errorMsg });
      return;
    }
    createOrgMutation.mutate(data);
  };

  useEffect(() => {
    form.setValue(
      "slug",
      slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    );
  }, [form, name]);

  return (
    <>
      <Head>
        <title>{`Create Org - ${APP_NAME}`}</title>
      </Head>

      <div className="container max-w-screen-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                      <FormLabel>Slug</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={createOrgMutation.isLoading}>
                    {createOrgMutation.isLoading && <ButtonLoader />}
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

CreateOrgPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default CreateOrgPage;
