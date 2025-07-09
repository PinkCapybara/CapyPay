import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "@repo/db/client";
import type {
  OnRampTransaction as OnRampTxnType,
  OffRampTransaction as OffRampTxnType,
  P2PTransfer as P2PTransferType,
  TxnStatus,
} from "@repo/store/types";

export const fetchBalance = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    try {
      const balance = await prisma.balance.findUnique({
        where: { userId: session.user.id },
        select: { amount: true, locked: true },
      });
      return balance
        ? { amount: balance.amount, locked: balance.locked }
        : { amount: 0, locked: 0 };
    } catch (error) {
      console.log("Error fetching balance:", error);
    }
  }

  return { amount: 0, locked: 0 };
};

export async function fetchOnRampTransactions(): Promise<OnRampTxnType[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const records = await prisma.onRampTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
    });
    return records.map((rec) => ({
      id: rec.id,
      status: rec.status as TxnStatus,
      token: rec.token,
      provider: rec.provider,
      amount: rec.amount,
      time: rec.startTime,
    }));
  } catch (error) {
    console.log("Error fetching on-ramp transactions:", error);
    return [];
  }
}

export async function fetchOffRampTransactions(): Promise<OffRampTxnType[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const records = await prisma.offRampTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
    });
    return records.map((rec) => ({
      id: rec.id,
      status: rec.status as TxnStatus,
      token: rec.token,
      vpa: rec.vpa,
      amount: rec.amount,
      time: rec.startTime,
    }));
  } catch (error) {
    console.log("Error fetching off-ramp transactions:", error);
    return [];
  }
}

export async function fetchP2PTransfers(): Promise<P2PTransferType[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }
  const userId = session.user.id;

  try {
    const records = await prisma.p2pTransaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: { timestamp: "desc" },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } },
      },
    });
    return records.map((rec) => ({
      id: rec.id,
      status: rec.status,
      amount: rec.amount,
      time: rec.timestamp,
      fromUser: {
        id: rec.fromUser.id,
        name: rec.fromUser.name,
        email: rec.fromUser.email,
      },
      toUser: {
        id: rec.toUser.id,
        name: rec.toUser.name,
        email: rec.toUser.email,
      },
    }));
  } catch (error) {
    console.log("Error fetching P2P transfers:", error);
    return [];
  }
}
