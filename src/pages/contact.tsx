import PageHeader from "@/components/PageHeader";
import { Button, ButtonLoader } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME, SUPPORT_EMAIL } from "@/utils/constants";
import { trpc } from "@/utils/trpc";
import { contactSchema } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ContactPage: NextPageWithLayout = () => {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const { toast } = useToast();
  const sendMutation = trpc.utils.sendContactMail.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Thank you so much for contact. We will get back to you as soon as possible.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) =>
    sendMutation.mutate(data);

  return (
    <main>
      <Head>
        <title>{`Contact - ${APP_NAME}`}</title>
      </Head>
      <PageHeader title="Get in touch" />
      <div className="container flex items-start justify-between gap-8 py-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-screen-sm flex-1 space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How can we help?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={sendMutation.isLoading}>
              {sendMutation.isLoading && <ButtonLoader />}
              Submit
            </Button>
          </form>
        </Form>

        <div className="w-80">
          <div>
            <p className="text-sm text-muted-foreground">Get help</p>
            <div className="flex items-center gap-1">
              <Link
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium hover:underline"
              >
                {SUPPORT_EMAIL}
              </Link>
              <CopyBtn text={SUPPORT_EMAIL} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

ContactPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default ContactPage;

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    if (copied) return;
    window.navigator.clipboard.writeText(text);
    setCopied(true);
  }, [copied, text]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <Button
      disabled={copied}
      variant="ghost"
      size="icon"
      onClick={onCopy}
      className="-my-2 h-8 w-8"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  );
};
