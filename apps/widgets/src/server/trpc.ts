import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { inferAsyncReturnType } from "@trpc/server";
import { db } from "@acme/db";
import { type NextRequest } from "next/server";
import { INTERNALS } from "next/dist/server/web/spec-extension/request";

interface AuthContext {
  clientIp?: string | null;
  headers: Headers;
}

export const createContextInner = async (opts: AuthContext) => {
  return {
    clientIp: opts.clientIp,
    db,
  };
};

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  return await createContextInner({
    clientIp: opts.req[INTERNALS]?.ip,
    headers: opts.req.headers,
  });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
