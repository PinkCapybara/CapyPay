import { PrismaClient } from "../../node_modules/@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    transactionOptions: {
      maxWait: 5000,
      timeout: 10000,
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma: ReturnType<typeof prismaClientSingleton> =
  globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
