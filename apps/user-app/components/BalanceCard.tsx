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
    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Total Balance
          </h2>
          <div className="text-3xl md:text-4xl font-bold text-white ">
            {total}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4">
            <div className="text-sm text-purple-200 mb-1">Available</div>
            <div className="text-lg font-semibold text-white">{amount}</div>
          </div>
          <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4">
            <div className="text-sm text-purple-200 mb-1">Locked</div>
            <div className="text-lg font-semibold text-white">{locked}</div>
          </div>
        </div>
      </div>

      <div className="bg-purple-800 bg-opacity-50 px-4 py-2"></div>
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
