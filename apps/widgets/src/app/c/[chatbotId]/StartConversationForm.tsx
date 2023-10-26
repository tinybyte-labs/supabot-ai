"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatbot } from "@/providers/ChatbotProvider";
import { api } from "@/utils/trpc/client";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email(),
});

export default function StartConversationForm() {
  const router = useRouter();
  const { chatbot } = useChatbot();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const startConvMutation = api.conversation.startConversation.useMutation({
    onSuccess(data) {
      router.push(`/c/${data.chatbotId}/conversations/${data.id}`);
    },
  });

  const handleCreateConversation = useCallback(
    (data: z.infer<typeof schema>) => {
      localStorage.setItem(`${chatbot.id}.user`, JSON.stringify(data));
      startConvMutation.mutate({
        ...data,
        chatbotId: chatbot.id,
      });
    },
    [chatbot.id, startConvMutation],
  );

  useEffect(() => {
    const userStr = localStorage.getItem(`${chatbot.id}.user`);
    if (userStr) {
      try {
        const user = schema.parse(JSON.parse(userStr));
        form.setValue("name", user.name);
        form.setValue("email", user.email);
      } catch (err) {}
    }
  }, [chatbot.id, form, router]);

  return (
    <form onSubmit={form.handleSubmit(handleCreateConversation)}>
      <fieldset>
        <input
          type="text"
          placeholder="Enter your name"
          className="h-[52px] w-full rounded-xl bg-slate-100 px-4 placeholder-slate-400"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm font-medium text-red-400">
            {form.formState.errors.name.message}
          </p>
        )}
      </fieldset>
      <fieldset>
        <input
          type="email"
          placeholder="Enter your name"
          className="mt-3 h-[52px] w-full rounded-xl bg-slate-100 px-4 placeholder-slate-400"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm font-medium text-red-400">
            {form.formState.errors.email.message}
          </p>
        )}
      </fieldset>
      <button
        type="submit"
        className="relative mt-6 flex h-[52px] w-full items-center justify-center rounded-xl bg-[var(--primary-bg)] px-4 text-center font-medium text-[var(--primary-fg)] hover:opacity-95 disabled:opacity-50"
        disabled={startConvMutation.isLoading}
      >
        {startConvMutation.isLoading ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin"
          >
            <path
              d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <>
            Start a conversation
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-6 top-1/2 -translate-y-1/2"
            >
              <path
                d="M4 12H20M20 12L14 6M20 12L14 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
