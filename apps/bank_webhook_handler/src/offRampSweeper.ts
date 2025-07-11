import axios from "axios";
import db from "@repo/db/client";
import redis from "@repo/redis/client";
import { Queue, Worker } from "bullmq";

const offRampQueue = new Queue("offRampQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "fixed", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const offRampWorker = new Worker(
  "offRampQueue",
  async (job) => {
    const { token } = job.data as {
      token: string;
      userId: string;
      amount: number;
    };

    const txn = await db.offRampTransaction.findUnique({
      where: { token },
      select: { id: true, userId: true, amount: true, vpa: true, status: true },
    });
    if (!txn || txn.status !== "Processing") {
      console.log(`skipping ${token} (no longer Processing)`);
      return;
    }

    const resp = await axios.post(
      `${process.env.MOCK_BANK_URL}/offRamp`,
      { transactionId: txn.id, amount: txn.amount, account: txn.vpa },
      { timeout: 10000 },
    );
    const { status }: { status: "Success" | "Failure" } = resp.data;

    await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "OffRampTransaction" WHERE id = ${txn.id} FOR UPDATE`;

      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${txn.userId} FOR UPDATE`;

      await tx.offRampTransaction.update({
        where: { id: txn.id },
        data: { status },
      });

      if (status === "Success") {
        await tx.balance.update({
          where: { userId: txn.userId },
          data: {
            locked: { decrement: txn.amount },
          },
        });
      } else {
        await tx.balance.update({
          where: { userId: txn.userId },
          data: {
            amount: { increment: txn.amount },
            locked: { decrement: txn.amount },
          },
        });
      }
    });

    console.log(`token ${token} processed: ${status}`);
  },
  {
    connection: redis,
    concurrency: 10, // Number of jobs a worker can process parallelly
  },
);

offRampWorker.on("completed", async (job) => {
  const { token, userId } = job.data as {
    token: string;
    userId: string;
    amount: number;
  };

  await redis.lrem("offRamps", 1, token);
  console.log(`Off-ramp job completed for token=${token} and userId=${userId}`);
});

const MAX_RETRIES = 5;
offRampWorker.on("failed", async (job, err) => {
  const { token } = job?.data as {
    token: string;
  };

  const attempts = job?.attemptsMade || 0;

  console.error(
    `Offramp retry ${attempts} failed for token=${token}:`,
    err.message,
  );

  if (attempts >= MAX_RETRIES) {
    const txn = await db.offRampTransaction.findUnique({
      where: { token },
      select: { id: true, userId: true, amount: true, status: true },
    });
    if (!txn) {
      console.error(
        `No transaction found for token=${token}; cannot mark Failure.`,
      );
      return;
    }
    if (txn.status !== "Processing") {
      console.log(
        `Token ${token} is no longer Processing; skipping Failure mark.`,
      );
      return;
    }

    console.error(`Max retries reached for token=${token}; marking Failure.`);
    await redis.lrem("offRamps", 1, token);

    await db.$transaction(async (tx) => {
      await tx.offRampTransaction.update({
        where: { token },
        data: { status: "Failure" },
      });
      await tx.balance.update({
        where: { userId: txn.userId },
        data: {
          amount: { increment: txn.amount },
          locked: { decrement: txn.amount },
        },
      });
    });
  }
});

export const sweepOffRamps = async () => {
  console.log("... enqueuing Off-Ramps ...");
  const tokens = await redis.lrange("offRamps", 0, -1);

  for (const token of tokens) {
    const txn = await db.offRampTransaction.findUnique({
      where: { token },
      select: { id: true, userId: true, amount: true, vpa: true, status: true },
    });

    if (!txn || txn.status !== "Processing") {
      console.log(`→ skipping ${token} (no longer Processing)`);
      continue;
    }

    await offRampQueue.add(
      "offramp-job",
      { token, userId: txn.userId, amount: txn.amount },
      { jobId: txn.userId },
    );
  }
};
