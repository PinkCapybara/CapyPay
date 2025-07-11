"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(
  token: string,
  provider: string,
  amount: number,
) {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user || !session.user?.id) {
      throw new Error("Unauthenticated request");
    }

    await prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Processing",
        startTime: new Date(),
        token,
        userId: session?.user?.id,
        amount: amount,
      },
    });

    return {
      success: true,
      message: "Done",
    };
  } catch (error: unknown) {
    console.error("OnRamp Transaction Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create onramp transaction",
    };
  }
}
