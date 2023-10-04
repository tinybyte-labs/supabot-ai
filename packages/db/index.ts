import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

export const db: PrismaClient = new PrismaClient();
