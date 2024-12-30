import { PrismaClient } from '@prisma/client';

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['query'], // Optional: Logs queries in development
  });
}

prisma = global.prisma;

export default prisma;
