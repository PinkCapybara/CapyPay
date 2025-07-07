import axios from 'axios';
import db from '@repo/db/client';
import redis from '@repo/redis/client';

export const sweepOffRamps = async  () => {
  console.log('Off-ramp sweep started');
  while (true) {
    const token = await redis.lpop("offramp-queue");
    if (!token) break;

    const txn = await db.offRampTransaction.findUnique({
      where: { token },
      select: { id: true, userId: true, amount: true, vpa: true, status: true },
    });
    if (!txn || txn.status !== 'Processing') {
      console.log(`→ skipping ${token} (no longer Processing)`);
      continue;
    }

    try {
      const resp = await axios.post(
        `${process.env.MOCK_BANK_URL}/offRamp`,
        { transactionId: txn.id, amount: txn.amount, account: txn.vpa },
        { timeout: 10000 }
      );
      const { status } : { status: 'Success' | 'Failure' } = resp.data;

      await db.$transaction(async (tx) => { 
        await tx.$queryRaw`SELECT * FROM "OffRampTransaction" WHERE id = ${txn.id} FOR UPDATE`;

        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${txn.userId} FOR UPDATE`;

        await tx.offRampTransaction.update({
            where: { id: txn.id },
            data: { status },
        });

        if (status === 'Success') {
            await tx.balance.update({
            where: { userId: txn.userId },
            data: {
                locked: { decrement: txn.amount } 
            },
            });
        } else {
            await tx.balance.update({
            where: { userId: txn.userId },
            data: {
                amount: { decrement: txn.amount },
                locked: { decrement: txn.amount },
            },
            });
        }
        });


    console.log(`token ${token} processed: ${status}`);

    } catch (err: any) {
      console.error(`error processing ${token}:`, err.message);
      await redis.rpush("offramp-queue", token);
    }
  }
  console.log('off-ramp sweep complete');
}