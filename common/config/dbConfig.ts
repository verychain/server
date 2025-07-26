import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (!global.prisma) {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
} else {
  prisma = global.prisma;
}

export default prisma;
