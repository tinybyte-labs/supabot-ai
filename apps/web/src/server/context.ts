import {
  SignedInAuthObject,
  SignedOutAuthObject,
  getAuth,
} from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import requestIp from "request-ip";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
  db: PrismaClient;
  clientIp: string | null;
}

export const createContextInner = async ({
  auth,
  db,
  clientIp,
}: AuthContext) => {
  return {
    auth,
    db,
    clientIp,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  const clientIp = requestIp.getClientIp(opts.req);
  return await createContextInner({ auth, db: prisma, clientIp });
};

export type Context = inferAsyncReturnType<typeof createContext>;
