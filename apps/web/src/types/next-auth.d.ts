import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type User = {
  id?: string;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
  }
}
