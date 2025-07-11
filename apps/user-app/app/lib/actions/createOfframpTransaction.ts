"use server";

import prisma from "@repo/db/client";
import redis from "@repo/redis/client";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOfframpTransaction(amount: number, vpa: string) {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user || !session.user?.id) {
      throw new Error("Unauthenticated request");
    }

    if (!amount || !vpa) throw new Error("Amount and VPA are required");

    const token = `offramp_${uuidv4()}`;

    const result = await prisma.$transaction(async (tx) => {
      const balance = await tx.balance.findUnique({
        where: { userId: session.user.id },
      });

      if (!balance || balance.amount < amount) {
        throw new Error("Insufficient balance");
      }

      // Lock the amount
      await tx.balance.update({
        where: { userId: session.user.id },
        data: {
          amount: { decrement: amount },
          locked: { increment: amount },
        },
      });

      const transaction = await tx.offRampTransaction.create({
        data: {
          status: "Processing",
          token,
          vpa,
          amount,
          startTime: new Date(),
          userId: session.user.id,
        },
      });

      return transaction;
    });

    await redis.rpush("offRamps", result.token);

    return {
      success: true,
      message: "Off-ramp transaction created successfully",
      txn: result,
    };
  } catch (err: unknown) {
    console.error("Off-ramp Transaction Error:", err);

    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Failed to create offramp transaction",
    };
  }
}
