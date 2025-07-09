import { DepositMoney } from "../../../components/DepositMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";

export default async function Deposit() {
  return (
    <div className="">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Deposit</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
