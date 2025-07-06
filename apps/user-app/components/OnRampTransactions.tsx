"use client"

import { Card } from "@repo/ui/card"
import { useAtomValue } from "jotai"
import { onRampTransactionsAtom } from "@repo/store/transactions"
import { TxnStatus } from "@repo/store/types"

export const OnRampTransactions = () => {
  const transactions = useAtomValue(onRampTransactionsAtom);

  if (!transactions.length) {
    return (
      <Card title="Recent On-Ramps">
        <div className="text-center py-4 text-sm text-slate-600">
          No Recent On-Ramp Transactions
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
    <Card title="Recent On-Ramps" scrollHeight="md">
      <div className="flex flex-col pt-1">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between text-sm p-1 rounded-lg hover:bg-[#E6E6FA] transition cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="font-medium text-slate-800">
                  Received INR
                </div>
                <span
                  className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${statusClasses(t.status)}`}
                >
                  {t.status}
                </span>
              </div>
              <div className="text-slate-500 text-xs mt-0.5">
                {new Date(t.time).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="font-semibold text-sm text-green-600">
              +₹{(t.amount / 100)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
};