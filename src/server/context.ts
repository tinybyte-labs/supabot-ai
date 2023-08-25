import {
  SignedInAuthObject,
  SignedOutAuthObject,
  getAuth,
} from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createContextInner = async ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  return await createContextInner({ auth });
};

export type Context = inferAsyncReturnType<typeof createContext>;
