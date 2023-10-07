import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

const prismaGlobal = global as typeof global & {
  db?: PrismaClient;
};

export const db: PrismaClient = prismaGlobal.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.db = db;
}
