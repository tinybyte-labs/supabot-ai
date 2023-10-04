import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@acme/db";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";
export type { Session } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: string;
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

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt: async ({ token, trigger, user }) => {
      if (!token.email || !token.sub) {
        return {};
      }

      if (user) {
        token.user = user;
      }

      if (trigger === "update") {
        const refreshedUser = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        });
        if (refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = {
        id: token.sub || "",
        ...(token || session).user,
      };
      return session;
    },
  },
};

export const getSession = (req: NextApiRequest, res: NextApiResponse) =>
  getServerSession(req, res, authOptions);
