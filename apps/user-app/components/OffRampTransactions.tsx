"use client";

import { Card } from "@repo/ui/card";
import { useAtomValue, useSetAtom } from "jotai";
import {
  offRampTransactionsAtom,
  fetchOffRampTransactionsAtom,
} from "@repo/store/transactions";
import { TxnStatus } from "@repo/store/types";
import { useEffect } from "react";

export const OffRampTransactions = () => {
  const transactions = useAtomValue(offRampTransactionsAtom);
  const refreshOffRampTransactions = useSetAtom(fetchOffRampTransactionsAtom);

  console.log("transactions are: ", transactions);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOffRampTransactions();
    }, 15000);

    return () => clearInterval(intervalId);
  });

  if (!transactions.length) {
    return (
      <Card title="Recent Withdrawals">
        <div className="py-4 text-center text-sm text-slate-600">
          No Recent Withdrawal Transactions
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
    <Card title="Recent Withdrawals" scrollHeight="md">
      <div className="flex flex-col pt-1">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex cursor-pointer items-center justify-between rounded-lg p-1 text-sm transition hover:bg-[#E6E6FA]"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="font-medium text-slate-800">
                  Transferred INR to bank
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

            <div className="text-sm font-semibold text-red-600">
              -₹{t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
