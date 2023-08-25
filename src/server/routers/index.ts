import { protectedProcedure, publicProcedure, router } from "../trpc";

export const appRouter = router({
  user: protectedProcedure.query(({ ctx }) => ctx.auth),
});

export type AppRouter = typeof appRouter;
