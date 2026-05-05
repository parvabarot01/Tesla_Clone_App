import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

let prismaClient: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

export function getPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    prismaClient ??= createPrismaClient();

    return prismaClient;
  }

  globalForPrisma.prisma ??= createPrismaClient();

  return globalForPrisma.prisma;
}
