import { useAtomValue } from "jotai";
import { filtererdTransactionsAtom } from "@repo/store/transactions";
import { TxnStatus } from "@repo/store/types";

export const TransactionCard = () => {
  const transactions = useAtomValue(filtererdTransactionsAtom);

  console.log("transactions :", transactions);

  // Status badge component
  const StatusBadge = ({ status }: { status: TxnStatus }) => {
    const statusColors = {
      Success: "bg-green-100 text-green-800",
      Failure: "bg-red-100 text-red-800",
      Processing: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  // Type badge component
  const TypeBadge = ({ type }: { type: string }) => {
    const typeColors: any = {
      deposit: "bg-blue-100 text-blue-800",
      withdrawal: "bg-purple-100 text-purple-800",
      p2p: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-gray-500">
          No transactions found matching your filters
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-14">
      {transactions.map((transaction) => (
        <div
          key={`${transaction.type}-${transaction.id}`}
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                {transaction.type === "deposit" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : transaction.type === "withdrawal" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                )}
              </div>

              <div>
                <div className="font-medium text-gray-900">
                  {transaction.type === "p2p"
                    ? `To: ${transaction.toUser.id.slice(0, 8)}...`
                    : transaction.type === "deposit"
                      ? `Deposited From: ${transaction.provider}`
                      : `PayOut To: ${transaction.vpa}`}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.time).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-medium ${
                  transaction.type === "deposit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "deposit" ? "+" : "-"}
                {formatINR(transaction.amount)}
              </div>
              <div className="mt-2 flex justify-end">
                <StatusBadge status={transaction.status} />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <TypeBadge type={transaction.type} />
            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              ID: {transaction.id}
            </div>
          </div>
        </div>
      ))}
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
