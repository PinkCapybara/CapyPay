import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth'; 
import prisma from '@repo/db/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const txns = await prisma.offRampTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { startTime: 'desc' }
    })

    return NextResponse.json({
      transactions: txns.map(t => ({
        id: t.id,
        token: t.token,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
      }))
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}