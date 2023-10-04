import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import requestIp from "request-ip";
import { db } from "@acme/db";
import { getSession, type Session } from "@acme/auth";

interface AuthContext {
  session: Session | null;
  clientIp: string | null;
}

export const createContextInner = async (opts: AuthContext) => {
  return {
    session: opts.session,
    clientIp: opts.clientIp,
    db,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession(opts.req, opts.res);
  const clientIp = requestIp.getClientIp(opts.req);
  return await createContextInner({ clientIp, session });
};

export type Context = inferAsyncReturnType<typeof createContext>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
