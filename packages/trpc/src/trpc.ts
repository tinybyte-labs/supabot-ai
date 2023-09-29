import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";
import { getAuth } from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import requestIp from "request-ip";
import { PrismaClient } from "@acme/db";

const prisma = new PrismaClient();

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
  clientIp: string | null;
}

export const createContextInner = async (opts: AuthContext) => {
  return {
    ...opts,
    db: prisma,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  const clientIp = requestIp.getClientIp(opts.req);
  return await createContextInner({ auth, clientIp });
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

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

// export this procedure to be used anywhere in your application
export const protectedProcedure = t.procedure.use(isAuthed);
