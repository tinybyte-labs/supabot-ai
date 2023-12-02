"use client";

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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .min(1, "Please enter your email address")
    .email(),
});
type Schema = z.infer<typeof schema>;

export default function EmailSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (data: Schema) => {
      setIsLoading(true);
      try {
        const res = await signIn("email", {
          email: data.email,
          redirect: false,
        });
        if (res?.ok) {
          toast({ title: "We have sent you a log in link to your email" });
        } else {
          throw new Error(res?.error || "Something went wrong");
        }
        console.log(res);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter you email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading || !form.formState.isValid}
          className="w-full"
        >
          {isLoading && <ButtonLoader />}
          Continue
        </Button>
      </form>
    </Form>
  );
}
