import { publicProcedure, router } from "../trpc";
import * as z from "zod";

export const appRouter = router({
  hello: publicProcedure.query(() => "Hello, world!"),
});

export type AppRouter = typeof appRouter;
