"use client";

import { Card } from "@repo/ui/card";
import { useAtomValue } from "jotai";
import { p2pTransfersAtom } from "@repo/store/transactions";
import { useSession } from "next-auth/react";
import { TxnStatus } from "@repo/store/types";

export const P2PTransactionsCard = () => {
  const transactions = useAtomValue(p2pTransfersAtom);
  const { data }: any = useSession();
  const currentUserId = data?.user?.id;

  if (!transactions.length) {
    return (
      <Card title="P2P Transactions">
        <div className="py-4 text-center text-sm text-slate-600">
          No P2P transactions yet
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
    <Card title="P2P Transactions" scrollHeight="md">
      <div className="flex flex-col pt-1">
        {transactions.map((t) => {
          //why is there a delay in the calculatoin of isSent, initially it is false, everyhing is rendered as it being false
          //then it is acutally calculated and proper values rendered
          const isSent = t.fromUser.id === currentUserId;
          const counterparty = isSent
            ? t.toUser.name || `User ${t.toUser.id.slice(0, 4)}`
            : t.fromUser.name || `User ${t.fromUser.id.slice(0, 4)}`;

          return (
            <div
              key={t.id}
              className="flex cursor-pointer items-center justify-between rounded-lg p-1 text-sm transition-all hover:bg-[#E6E6FA]"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-slate-800">
                    {isSent
                      ? `Sent INR To ${counterparty}`
                      : `Received INR From ${counterparty}`}
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

              <div
                className={`text-sm font-semibold ${isSent ? "text-red-600" : "text-green-600"}`}
              >
                {isSent ? "-" : "+"}₹{(t.amount / 100).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
