import prisma from "../index";
import bcrypt from "bcrypt";
import { TxnStatus } from "@prisma/client";

async function main() {
  // Existing users
  const alice = await prisma.user.upsert({
    where: { number: "1111111111" },
    update: {},
    create: {
      number: "1111111111",
      password: await bcrypt.hash("alice", 10),
      name: "alice",
      Balance: {
        create: {
          amount: 2000000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 2000000,
          token: "token__1",
          provider: "HDFC Bank",
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { number: "2222222222" },
    update: {},
    create: {
      number: "2222222222",
      password: await bcrypt.hash("bob", 10),
      name: "bob",
      Balance: {
        create: {
          amount: 200000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 200000,
          token: "token__2",
          provider: "HDFC Bank",
        },
      },
    },
  });

  const charlie = await prisma.user.upsert({
    where: { number: "3333333333" },
    update: {},
    create: {
      number: "3333333333",
      password: await bcrypt.hash("charlie", 10),
      name: "charlie",
      Balance: {
        create: {
          amount: 1500000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(),
            status: "Success",
            amount: 1000000,
            token: "token__3",
            provider: "SBI Bank",
          },
          {
            startTime: new Date(),
            status: "Success",
            amount: 500000,
            token: "token__4",
            provider: "Axis Bank",
          },
        ],
      },
    },
  });

  const david = await prisma.user.upsert({
    where: { number: "4444444444" },
    update: {},
    create: {
      number: "4444444444",
      password: await bcrypt.hash("david", 10),
      name: "david",
      Balance: {
        create: {
          amount: 800000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(),
            status: "Processing",
            amount: 500000,
            token: "token__5",
            provider: "ICICI Bank",
          },
          {
            startTime: new Date(),
            status: "Success",
            amount: 300000,
            token: "token__6",
            provider: "Kotak Bank",
          },
        ],
      },
    },
  });

  await prisma.offRampTransaction.createMany({
    data: [
      {
        status: "Success" as TxnStatus,
        token: "off_token__1",
        vpa: "alice@upi",
        amount: 200000,
        startTime: new Date(),
        userId: alice.id,
      },
      {
        status: "Failure" as TxnStatus,
        token: "off_token__2",
        vpa: "bob@ybl",
        amount: 50000,
        startTime: new Date(),
        userId: bob.id,
      },
      {
        status: "Processing" as TxnStatus,
        token: "off_token__3",
        vpa: "charlie@oksbi",
        amount: 300000,
        startTime: new Date(),
        userId: charlie.id,
      },
      {
        status: "Success" as TxnStatus,
        token: "off_token__4",
        vpa: "david@axis",
        amount: 150000,
        startTime: new Date(),
        userId: david.id,
      },
    ],
  });

  await prisma.p2pTransaction.createMany({
    data: [
      {
        status: "Success" as TxnStatus,
        amount: 100000,
        timestamp: new Date(),
        fromUserId: alice.id,
        toUserId: bob.id,
      },
      {
        status: "Success" as TxnStatus,
        amount: 50000,
        timestamp: new Date(),
        fromUserId: bob.id,
        toUserId: charlie.id,
      },
      {
        status: "Failure" as TxnStatus,
        amount: 200000,
        timestamp: new Date(),
        fromUserId: charlie.id,
        toUserId: david.id,
      },
      {
        status: "Processing" as TxnStatus,
        amount: 75000,
        timestamp: new Date(),
        fromUserId: david.id,
        toUserId: alice.id,
      },
      {
        status: "Success" as TxnStatus,
        amount: 150000,
        timestamp: new Date(),
        fromUserId: alice.id,
        toUserId: david.id,
      },
      {
        status: "Success" as TxnStatus,
        amount: 80000,
        timestamp: new Date(),
        fromUserId: charlie.id,
        toUserId: bob.id,
      },
    ],
  });

  await prisma.$transaction(async (tx) => {
    await tx.balance.update({
      where: { userId: alice.id },
      data: {
        amount: { decrement: 200000 },
      },
    });

    await tx.balance.update({
      where: { userId: bob.id },
      data: {
        amount: {
          increment: 50000,
        },
      },
    });

    await tx.balance.update({
      where: { userId: charlie.id },
      data: {
        amount: {
          decrement: 30000,
        },
        locked: { increment: 300000 }, // off-ramp processing
      },
    });
  });

  console.log("Database seeded successfully!");
  console.log({ alice, bob, charlie, david });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
