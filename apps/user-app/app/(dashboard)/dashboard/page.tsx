"use client"
import { useSession } from "next-auth/react";
import { useAtomValue } from 'jotai';
import { balanceAtom } from '@repo/store/balance';
import { onRampTransactionsAtom, offRampTransactionsAtom, p2pTransfersAtom } from '@repo/store/transactions';


export default function Dashboard() {
    const balanceState = useAtomValue(balanceAtom);
    // const onRampTransactions = useAtomValue(onRampTransactionsAtom);
    // const offRampTransactions = useAtomValue(offRampTransactionsAtom);
    // const p2pTransfers = useAtomValue(p2pTransfersAtom);

    // console.log("balanceState", balanceState);
    // console.log("onRampTransactions", onRampTransactions);
    // console.log("offRampTransactions", offRampTransactions);
    // console.log("p2pTransfers", p2pTransfers);

    return <div>
        Dashboard Page <br/>
        {balanceState?.amount}
    </div>
}

