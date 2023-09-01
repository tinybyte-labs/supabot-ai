import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import fetchUrlsFromSitemap from "@/utils/fetchUrlsFromSitemap";
import fetchUrlsFromWebsite from "@/utils/fetchUrlsFromWebsite";

export const utilsRouter = router({
  getLinksFromWebsite: protectedProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => fetchUrlsFromWebsite(input)),
  getLinksFromSitemap: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => fetchUrlsFromSitemap(input)),
});
