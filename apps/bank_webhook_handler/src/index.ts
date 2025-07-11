import express from "express";
import crypto from "crypto";
import db from "@repo/db/client";
import schedule from "node-schedule";
import { sweepOffRamps } from "./offRampSweeper";
import { sweepOnRamps } from "./onRampSweeper";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3003;
const WEBHOOK_SECRET = process.env.BANK_WEBHOOK_SECRET || "default_secret_key";

app.use(express.json());

app.post("/bankWebhook", async (req, res) => {
  const signature = req.get("X-Bank-Signature") || "";
  console.log("Received webhook with signature:", signature);
  const payloadString = JSON.stringify(req.body);
  console.log("Payload string:", payloadString);
  const expectedSig = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payloadString)
    .digest("hex");

  console.log("Expected signature:", expectedSig);
  const sigMatch = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig),
  );
  if (!sigMatch) {
    res.status(403).json({ message: "Invalid signature" });
    return;
  }

  // 2) Extract and validate fields
  const { token, status } = req.body as {
    token: string;
    status: "Success" | "Failure";
    amount: number;
  };
  if (!token || !status) {
    res.status(400).json({ message: "token and status are required" });
    return;
  }

  try {
    const txn = await db.onRampTransaction.findUnique({
      where: { token },
      select: { id: true, userId: true, amount: true, status: true },
    });

    if (!txn) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }
    if (txn.status !== "Processing") {
      res.status(200).json({ message: "Transaction already processed" });
      return;
    }

    await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM "OnRampTransaction" WHERE "id" = ${txn.id} FOR UPDATE`;

      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${txn.userId} FOR UPDATE`;

      await tx.onRampTransaction.update({
        where: { id: txn.id },
        data: { status },
      });
      if (status === "Success") {
        await tx.balance.update({
          where: { userId: txn.userId },
          data: { amount: { increment: txn.amount } },
        });
      }
    });

    res.status(200).json({ message: "Webhook processed" });
  } catch (err: unknown) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`bankWebhook listening on port ${PORT}`);
});

// schedule to run every
schedule.scheduleJob("*/40 * * * * *", async () => {
  sweepOffRamps().catch((err: unknown) =>
    console.log("OffRamp Sweeper crashed:", err),
  );
  sweepOnRamps().catch((err: unknown) =>
    console.log("OnRamp Sweeper crashed:", err),
  );
});
