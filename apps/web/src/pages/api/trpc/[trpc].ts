import { appRouter, createContext, createNextApiHandler } from "@acme/trpc";

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
