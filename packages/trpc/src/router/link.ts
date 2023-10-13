import { TRPCError } from "@trpc/server";
import { qstash } from "@acme/upstash";
import { protectedProcedure, router } from "../trpc";
import * as z from "zod";
import { trainLink } from "@acme/core";
import { hasUserAccessToChatbot } from "./utils";

export const linkRouter = router({
  getLinksForChatbot: protectedProcedure
    .input(z.object({ chatbotId: z.string() }))
    .query(async (opts) => {
      const { chatbot } = await hasUserAccessToChatbot(
        opts.input.chatbotId,
        opts.ctx,
      );

      const links = await opts.ctx.db.link.findMany({
        where: { chatbot: { id: chatbot.id } },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return links;
    }),
  createLink: protectedProcedure
    .input(z.object({ chatbotId: z.string(), url: z.string().url() }))
    .mutation(async (opts) => {
      const { chatbot, plan, organization } = await hasUserAccessToChatbot(
        opts.input.chatbotId,
        opts.ctx,
      );

      const linksLimit = plan.limits.links;

      if (linksLimit !== "unlimited") {
        const linkCount = await opts.ctx.db.link.count({
          where: {
            chatbot: { organizationId: organization.id },
          },
        });
        if (linkCount >= linksLimit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You reached your link limits.",
          });
        }
      }

      const newLink = await opts.ctx.db.link.create({
        data: { url: opts.input.url, chatbotId: chatbot.id },
      });

      if (process.env.NODE_ENV === "development") {
        await trainLink(newLink.id, opts.ctx.db);
      } else {
        await qstash.publishJSON({
          body: {
            linkId: newLink.id,
          },
          topic: "train-link",
        });
      }

      return newLink;
    }),
  retrainLink: protectedProcedure
    .input(z.object({ linkId: z.string() }))
    .mutation(async (opts) => {
      const link = await opts.ctx.db.link.findUnique({
        where: { id: opts.input.linkId },
      });

      if (!link) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Link not found!" });
      }

      await hasUserAccessToChatbot(link.chatbotId, opts.ctx);

      if (link.status === "TRAINING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Link is already in training.",
        });
      }

      const updatedLink = await opts.ctx.db.link.update({
        where: { id: link.id },
        data: { status: "QUEUED", error: null, lastTrainedAt: null },
      });

      if (process.env.NODE_ENV === "development") {
        await trainLink(updatedLink.id, opts.ctx.db);
      } else {
        await qstash.publishJSON({
          body: {
            linkId: updatedLink.id,
          },
          topic: "train-link",
        });
      }

      return updatedLink;
    }),
  deleteLink: protectedProcedure
    .input(z.object({ linkId: z.string() }))
    .mutation(async (opts) => {
      const link = await opts.ctx.db.link.findUnique({
        where: { id: opts.input.linkId },
      });

      if (!link) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Link not found!" });
      }

      await hasUserAccessToChatbot(link.chatbotId, opts.ctx);

      const deletedLink = await opts.ctx.db.link.delete({
        where: { id: link.id },
      });

      return deletedLink;
    }),
});
