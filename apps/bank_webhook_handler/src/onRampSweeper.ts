import db from "@repo/db/client";
import axios from "axios";

export const sweepOnRamps = async () => {
  console.log("on-Ramp sweep started");

  const pendings = await db.onRampTransaction.findMany({
    where: { status: "Processing" },
    select: { token: true, id: true, userId: true, amount: true },
  });

  for (const txn of pendings) {
    try {
      const resp = await axios.get(
        `${process.env.MOCK_BANK_URL}/onRamp/status/${txn.token}`,
        { timeout: 10000 },
      );
      const { status }: { status: "Processing" | "Success" | "Failure" } =
        resp.data;
      if (status === "Processing") continue;

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
      //await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${txn.userId} FOR UPDATE`;

      console.log(`On-Ramp ${txn.token} processed: ${status}`);
    } catch (err: any) {
      console.error(`On-Ramp ${txn.token} error:`, err.message);
    }
  }
  console.log("On-Ramp sweep complete");
};
