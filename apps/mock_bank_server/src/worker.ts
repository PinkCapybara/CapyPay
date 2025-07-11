import { Worker } from "bullmq";
import axios from "axios";
import redis from "@repo/redis/client";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

enum OnRampStatus {
  Processing = "Processing",
  Success = "Success",
  Failure = "Failure",
}

interface OnRampEntry {
  amount: number;
  status: OnRampStatus;
  callbackUrl: string;
}

const SECRET_KEY = process.env.BANK_WEBHOOK_SECRET || "default_secret_key";

// Compute HMAC signature
function signPayload(payload: {
  token: string;
  status: OnRampStatus;
  amount: number;
}) {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(JSON.stringify(payload));
  return hmac.digest("hex");
}

const MAX_RETRIES = 5;

const onRampWorker = new Worker(
  "onRampQueue",
  async (job) => {
    console.log(`Worker running Processing job ${job.id} with data:`, job.data);
    const { token, entry } = job.data as {
      token: string;
      entry: OnRampEntry;
    };

    // simulate success/failure
    const success = Math.random() < 0.8;
    const newStatus = success ? OnRampStatus.Success : OnRampStatus.Failure;

    const payload = { token, status: newStatus, amount: entry.amount };
    const signature = signPayload(payload);
    console.log(`Delivering webhook with payload=${JSON.stringify(payload)}`);
    await redis.hset(
      "onRamps",
      token,
      JSON.stringify({
        ...entry,
        status: newStatus,
      }),
    );
    await axios.post(entry.callbackUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Bank-Signature": signature,
      },
      timeout: 10000,
    });

    console.log(`Webhook delivered: token=${token}, status=${newStatus}`);
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

onRampWorker.on("failed", async (job, err) => {
  const { token, entry } = job?.data as { token: string; entry: OnRampEntry };
  const ret = await redis.hget("onRamps", token);
  if (!ret) {
    console.error(`No entry found for token=${token}; cannot retry.`);
    return;
  }
  const attempts = job?.attemptsMade || 0;

  console.error(
    `Webhook retry ${attempts} failed for token=${token}:`,
    err.message,
  );

  if (attempts >= MAX_RETRIES) {
    console.error(`Max retries reached for token=${token}; marking Failure.`);
    await redis.hset(
      "onRamps",
      token,
      JSON.stringify({
        ...entry,
        status: "Failure",
      }),
    );
  }
});
