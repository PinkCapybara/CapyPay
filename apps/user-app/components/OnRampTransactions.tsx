"use client";

import { Card } from "@repo/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import {
  onRampTransactionsAtom,
  fetchOnRampTransactionsAtom,
} from "@repo/store/transactions";
import { TxnStatus } from "@repo/store/types";
import { useEffect } from "react";

export const OnRampTransactions = () => {
  const transactions = useAtomValue(onRampTransactionsAtom);
  const refreshOnRampTransactions = useSetAtom(fetchOnRampTransactionsAtom);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOnRampTransactions();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  if (!transactions.length) {
    return (
      <Card title="Recent Deposits">
        <div className="py-4 text-center text-sm text-slate-600">
          No Recent Deposit Transactions
        </div>
      </Card>
    );
  }

  const statusClasses = (status: TxnStatus) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Failure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card title="Recent Deposits" scrollHeight="md">
      <div className="flex flex-col pt-1">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex cursor-pointer items-center justify-between rounded-lg p-1 text-sm transition hover:bg-[#E6E6FA]"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="font-medium text-slate-800">
                  Added INR to Wallet
                </div>
                <span
                  className={`me-2 rounded-sm px-2.5 py-0.5 text-xs font-medium ${statusClasses(t.status)}`}
                >
                  {t.status}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {new Date(t.time).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="text-sm font-semibold text-green-600">
              +₹{t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
