"use client";

import { Card } from "@repo/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import { balanceAtom, fetchBalanceAtom } from "@repo/store/balance";
import { useEffect } from "react";

export const BalanceCard = () => {
    const balance = useAtomValue(balanceAtom);
    const refreshBalance = useSetAtom(fetchBalanceAtom);
    const { amount, locked } = balance;
    const total = amount + locked;

    useEffect(() => {
  
    const intervalId = setInterval(() => {
      refreshBalance();
    }, 15000); 

    return () => clearInterval(intervalId);
  }, []);

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