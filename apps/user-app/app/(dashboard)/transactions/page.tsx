"use client";
import { TransactionFilters } from "../../../components/TransactionFIlters";
import { TransactionCard } from "../../../components/TransactionCard";

export default function Transaction() {
  return (
    <div className="">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Recent Transactions
      </div>
      <div className="flex-col p-4">
        <TransactionFilters />
        <TransactionCard />
      </div>
    </div>
  );
}
