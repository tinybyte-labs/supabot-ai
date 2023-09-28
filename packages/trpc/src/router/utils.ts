import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { contactSchema } from "../validators";
import { fetchUrlsFromSitemap, fetchUrlsFromWebsite } from "../utils";
import "@clerk/nextjs/api";

export const utilsRouter = router({
  getLinksFromWebsite: protectedProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => fetchUrlsFromWebsite(input)),
  getLinksFromSitemap: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => fetchUrlsFromSitemap(input)),
  sendContactMail: publicProcedure.input(contactSchema).mutation((opts) => {
    const { email, message } = opts.input;
  }),
});
