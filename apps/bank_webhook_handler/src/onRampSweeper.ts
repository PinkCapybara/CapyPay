import db from "@repo/db/client";
import axios from "axios";

export const sweepOnRamps = async () => {
  console.log("... reconciling On-Ramps ...");

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

      console.log(`Processing On-Ramp ${txn.token} with status: ${status}`);

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

      console.log(`On-Ramp ${txn.token} processed: ${status}`);
    } catch (err: unknown) {
      console.error(
        `On-Ramp ${txn.token} error:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
};
