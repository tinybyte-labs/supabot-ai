import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { compareDesc } from "date-fns";
import { hasUserAccessToChatbot } from "./utils";
import { IpInfo, getIpInfo } from "@acme/core/utils/ipinfo";

const publicConversationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        userId: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let ipInfo: IpInfo | null = null;
      if (ctx.clientIp) {
        ipInfo = await getIpInfo(ctx.clientIp);
      }
      return ctx.db.conversation.create({
        data: {
          chatbotId: input.chatbotId,
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.url ? { url: input.url } : {}),
          ...(ipInfo ? { ipInfo } : {}),
          ...(ctx.clientIp ? { ipAddress: ctx.clientIp } : {}),
        },
      });
    }),

  publicGetById: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      return conversation;
    }),
  publicList: publicProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversations = await ctx.db.conversation.findMany({
        where: {
          chatbotId: input.chatbotId,
          userId: input.userId,
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
          status: true,
          messages: {
            select: {
              role: true,
              body: true,
              updatedAt: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return conversations
        .filter((conversation) => conversation.messages.length > 0)
        .sort((a, b) =>
          compareDesc(a.messages[0].updatedAt, b.messages[0].updatedAt),
        );
    }),
  publicUpdate: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        chatbotId: z.string(),
        userId: z.string().optional(),
        data: z.object({
          status: z.enum(["CLOSED"]).optional(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const conversation = await opts.ctx.db.conversation.findFirst({
        where: {
          chatbotId: opts.input.chatbotId,
          id: opts.input.conversationId,
        },
      });
      if (
        !conversation ||
        (conversation.userId && conversation.userId !== opts.input.userId)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      return opts.ctx.db.conversation.update({
        where: { id: opts.input.conversationId },
        data: {
          ...(opts.input.data.status
            ? {
                status: opts.input.data.status,
                ...(opts.input.data.status === "CLOSED"
                  ? { closedAt: new Date() }
                  : {}),
              }
            : {}),
        },
      });
    }),
});

export const conversationRouter = router({
  getConversationById: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async (otps) => {
      const conversation = await otps.ctx.db.conversation.findFirst({
        where: { id: otps.input.conversationId },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }
      return conversation;
    }),
  getConversationsForChatbot: protectedProcedure
    .input(
      z.object({
        chatbotId: z.string(),
        status: z.enum(["OPEN", "CLOSED"]).optional(),
      }),
    )
    .query(async (opts) => {
      const { chatbot } = await hasUserAccessToChatbot(
        opts.input.chatbotId,
        opts.ctx,
      );

      const conversations = await opts.ctx.db.conversation.findMany({
        where: {
          chatbotId: chatbot.id,
          ...(opts.input.status ? { status: opts.input.status } : {}),
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true,
          status: true,
          messages: {
            select: {
              role: true,
              body: true,
              updatedAt: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
      });

      return conversations
        .filter((conversation) => conversation.messages.length > 0)
        .sort((a, b) =>
          compareDesc(a.messages[0].updatedAt, b.messages[0].updatedAt),
        );
    }),
  updateConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        data: z.object({
          status: z.enum(["OPEN", "CLOSED"]).optional(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const conversation = await opts.ctx.db.conversation.findFirst({
        where: {
          id: opts.input.conversationId,
          chatbot: {
            organization: {
              members: { some: { userId: opts.ctx.session.user.id } },
            },
          },
        },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
        });
      }

      await hasUserAccessToChatbot(conversation.chatbotId, opts.ctx);

      const { status } = opts.input.data;
      const updatedConversation = await opts.ctx.db.conversation.update({
        where: { id: conversation.id },
        data: {
          ...(status ? { status: status } : {}),
          ...(status === "CLOSED" ? { closedAt: new Date() } : {}),
        },
      });

      return updatedConversation;
    }),
  public: publicConversationRouter,
});
