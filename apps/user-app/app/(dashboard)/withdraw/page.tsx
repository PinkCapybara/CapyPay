import { WithdrawMoney } from "../../../components/WithdrawMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OffRampTransactions } from "../../../components/OffRampTransactions";

export default async function Withdraw() {
  return (
    <div className="">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        Withdraw
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div>
          <WithdrawMoney />
        </div>
        <div>
          <BalanceCard />
          <div className="pt-4">
            <OffRampTransactions />
          </div>
        </div>
      </div>
    </div>
  );
}
