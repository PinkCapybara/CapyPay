"use client";

import { Card } from "@repo/ui/card";
import { useAtomValue } from "jotai";
import { balanceAtom } from "@repo/store/balance";

export const BalanceCard = () => {
    const balance = useAtomValue(balanceAtom);
    const { amount, locked } = balance;
    const total = amount + locked;

    return (
        <Card title={"Balance"}>
            <div className="flex justify-between border-b border-slate-300 pb-2">
                <div>Unlocked balance</div>
                <div>₹{(amount / 100)}</div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>Total Locked Balance</div>
                <div>₹{(locked / 100)}</div>
            </div>
            <div className="flex justify-between border-b border-slate-300 py-2">
                <div>Total Balance</div>
                <div>₹{(total / 100)}</div>
            </div>
        </Card>
    );
};