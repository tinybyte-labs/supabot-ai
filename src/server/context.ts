import {
  SignedInAuthObject,
  SignedOutAuthObject,
  getAuth,
} from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
  db: PrismaClient;
}

export const createContextInner = async ({ auth, db }: AuthContext) => {
  return {
    auth,
    db,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  return await createContextInner({ auth, db: prisma });
};

export type Context = inferAsyncReturnType<typeof createContext>;
