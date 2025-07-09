"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { balanceAtom, fetchBalanceAtom } from "@repo/store/balance";

export const BalanceCard = () => {
  const balance = useAtomValue(balanceAtom);
  const amount = formatINR(balance.amount);
  const locked = formatINR(balance.locked);
  const total = formatINR(balance.amount + balance.locked);
  const refreshBalance = useSetAtom(fetchBalanceAtom);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshBalance();
    }, 15000);

    return () => clearInterval(intervalId);
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 shadow-xl">
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            Total Balance
          </h2>
          <div className="text-3xl font-bold text-white md:text-4xl">
            {total}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-opacity-30 rounded-lg bg-purple-600 p-4">
            <div className="mb-1 text-sm text-purple-200">Available</div>
            <div className="text-lg font-semibold text-white">{amount}</div>
          </div>
          <div className="bg-opacity-30 rounded-lg bg-purple-600 p-4">
            <div className="mb-1 text-sm text-purple-200">Locked</div>
            <div className="text-lg font-semibold text-white">{locked}</div>
          </div>
        </div>
      </div>

      <div className="bg-opacity-50 bg-purple-800 px-4 py-2"></div>
    </div>
  );
};

function formatINR(paiseAmount: number): string {
  const rupees = paiseAmount / 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(rupees);
}
