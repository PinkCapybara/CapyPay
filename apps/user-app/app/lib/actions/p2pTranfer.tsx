"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(
    toIdentifier: string, 
    amount: number,
    identifierType: "number" | "email"
) {
    const session = await getServerSession(authOptions);
    const fromUserId = session?.user?.id;
    
    if (!fromUserId) {
        throw new Error("You must be logged in to send money");
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Invalid amount format");
    }

    const toUser = await prisma.user.findFirst({
        where: identifierType === "number" 
            ? { number: toIdentifier }
            : { email: toIdentifier }
    });

    if (!toUser) {
        throw new Error(`User not found with this ${identifierType}`);
    }

    if (toUser.id === fromUserId) {
        throw new Error("You cannot send money to yourself");
    }

    const transactionRecord = await prisma.p2pTransaction.create({
        data: {
            status: "Processing",
            amount: amount,
            timestamp: new Date(),
            fromUserId: fromUserId,
            toUserId: toUser.id
        }
    });

    try {
        await prisma.$transaction(async (tx) => {
            // Lock sender's balance for update      
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUserId} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: fromUserId },
            });

            if (!fromBalance) {
                throw new Error("Sender account balance not found");
            }

            if (fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            await tx.balance.update({
                where: { userId: fromUserId },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.upsert({
                where: { userId: toUser.id },
                update: { amount: { increment: amount } },
                create: {
                    userId: toUser.id,
                    amount: amount,
                    locked: 0
                }
            });

            await tx.p2pTransaction.update({
                where: { id: transactionRecord.id },
                data: { status: "Success" }
            });
        });

        return { 
            message: `Successfully sent ₹${(amount / 100)} to ${toUser.name || toIdentifier}` 
        };
    } catch (error: any) {
        console.log("P2P Transfer Error:", error);

        await prisma.p2pTransaction.update({
            where: { id: transactionRecord.id },
            data: { 
                status: "Failure",
            }
        });

        throw new Error(error.message);
    }
}