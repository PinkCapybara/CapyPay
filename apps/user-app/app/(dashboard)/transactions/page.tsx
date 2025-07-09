"use client";
import { TransactionFilters } from "../../../components/TransactionFIlters";
import { TransactionCard } from "../../../components/TransactionCard";

export default function Transaction() {
  return (
    <div className="">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        Recent Transactions
      </div>
      <div className="flex-col p-4">
        <TransactionFilters />
        <TransactionCard />
      </div>
    </div>
  );
}
