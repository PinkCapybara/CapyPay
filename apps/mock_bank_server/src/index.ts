// A simple Express mock bank server for on-ramp and off-ramp transactions

import cors from "cors";
import express from "express";
import { Queue } from "bullmq";
import { v4 as uuidv4 } from "uuid";
import schedule from "node-schedule";
import dotenv from "dotenv";
import "./worker";
dotenv.config();
import redis from "@repo/redis/client";

const onRampQueue = new Queue("onRampQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "fixed", delay: 100000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

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

const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mock Bank Server is running");
});

app.post("/onRamp", async (req, res) => {
  const { amount, callbackUrl } = req.body;
  if (!amount || !callbackUrl) {
    res.status(400).json({ error: "amount and callbackUrl are required" });
    return;
  }

  const token = `tok_${uuidv4()}`;
  const entry: OnRampEntry = {
    amount,
    status: OnRampStatus.Processing,
    callbackUrl,
  };
  await redis.hset("onRamps", token, JSON.stringify(entry));

  console.log(`On-ramp initiated: token=${token}, amount=${amount}`);
  res.status(200).json({ token });
});

app.post("/offRamp", (req, res) => {
  const { transactionId, amount, account } = req.body;
  if (!transactionId || !amount || !account) {
    res
      .status(400)
      .json({ error: "transactionId, amount, and account are required" });
    return;
  }

  const success = Math.random() < 0.8;
  const status = success ? OnRampStatus.Success : OnRampStatus.Failure;
  console.log(
    `Off-ramp processed: txn=${transactionId}, amount=${amount}, account=${account}, status=${status}`,
  );
  res.json({ status });
});

app.get("/onRamp/status/:token", async (req, res) => {
  const token = req.params.token;
  const ret = await redis.hget("onRamps", token);
  const entry = ret ? (JSON.parse(ret) as OnRampEntry) : null;

  console.log(`Checking status for token=${token} found entry:`, entry);
  if (!entry) {
    res.status(404).json({ error: "Token not found" });
    return;
  }
  res.json({ token, amount: entry.amount, status: entry.status });
});

schedule.scheduleJob("* * * * *", async () => {
  console.log("enqueueing on-ramp jobs…");
  const all = await redis.hgetall("onRamps");

  const onRamps = Object.entries(all).map(([token, json]) => [
    token,
    JSON.parse(json) as OnRampEntry,
  ]) as [string, OnRampEntry][];
  const pendingOnRamps = onRamps.filter(
    ([, entry]) => entry.status === OnRampStatus.Processing,
  );
  console.log(`Found ${pendingOnRamps.length} pending on-ramps`);

  for (const [token, entry] of pendingOnRamps) {
    if (entry.status !== OnRampStatus.Processing) continue;
    onRampQueue.add(token, { token, entry }, { jobId: token });
  }
});

app.listen(port, () =>
  console.log(`Mock bank server listening on port ${port}`),
);
