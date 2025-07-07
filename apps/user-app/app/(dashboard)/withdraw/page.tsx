import { WithdrawMoney } from "../../../components/WithdrawMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OffRampTransactions } from "../../../components/OffRampTransactions";

export default async function Withdraw() {

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Withdraw
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
}