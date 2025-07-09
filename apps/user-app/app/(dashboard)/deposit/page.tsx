import { DepositMoney } from "../../../components/DepositMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";

export default async function Deposit() {
  return (
    <div className="">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">Deposit</div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="">
          <DepositMoney />
        </div>
        <div className="">
          <BalanceCard />
          <div className="pt-4">
            <OnRampTransactions />
          </div>
        </div>
      </div>
    </div>
  );
}
