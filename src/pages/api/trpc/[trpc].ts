import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
