import { BalanceCard } from "../../../components/BalanceCard";
import { SendCard } from "../../../components/SendCard";
import { P2PTransactionsCard } from "../../../components/P2PTransactions";

export default function p2pTransferPage() {
  return (
    <div className="">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Peer-to-Peer Transfers
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
