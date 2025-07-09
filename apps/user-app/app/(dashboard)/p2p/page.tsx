import { BalanceCard } from "../../../components/BalanceCard";
import { SendCard } from "../../../components/SendCard";
import { P2PTransactionsCard } from "../../../components/P2PTransactions";

export default function p2pTransferPage() {
  return (
    <div className="">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        Peer-to-Peer Transfers
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="space-y-4">
          <SendCard />
        </div>
        <div className="space-y-4">
          <BalanceCard />
          <P2PTransactionsCard />
        </div>
      </div>
    </div>
  );
}
