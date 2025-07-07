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
    const txns = await prisma.p2pTransaction.findMany({
  
        where: {
          OR: [
            { fromUserId: session.user.id },
            { toUserId: session.user.id }
          ]
        },
        orderBy: { timestamp: 'desc' },
        include: {
          fromUser: {
            select: { name: true, email: true }
          },
          toUser: {
            select: { name: true, email: true }
          }
        },
    })

    return NextResponse.json({
      transactions: txns.map(t => ({
        id: t.id,
        status: t.status,
        amount: t.amount,
        time: t.timestamp,  
        fromUser: {
            id: t.fromUserId,
            name: t.fromUser?.name || 'Unknown',
            email: t.fromUser?.email || 'Unknown'
        },
        toUser: {
            id: t.toUserId,
            name: t.toUser?.name || 'Unknown',
            email: t.toUser?.email || 'Unknown'
        }
      }))
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}