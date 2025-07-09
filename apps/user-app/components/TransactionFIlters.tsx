import { useAtom } from "jotai";
import { filterAtom } from "@repo/store/transactions";
import { TxnStatus } from "@repo/store/types";

const statusOptions: TxnStatus[] = ["Failure", "Processing", "Success"];

export const TransactionFilters = () => {
  const [filters, setFilters] = useAtom(filterAtom);

  const toggleFilter = (status: TxnStatus) => {
    if (filters.includes(status)) {
      setFilters(filters.filter((f) => f !== status));
    } else {
      setFilters([...filters, status]);
    }
  };

  const toggleAll = () => {
    if (filters.length === statusOptions.length) {
      setFilters([]);
    } else {
      setFilters([...statusOptions]);
    }
  };

  return (
    <div className="mb-6 h-fit rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-gray-700">Filter by status:</span>

        <button
          onClick={toggleAll}
          className={`rounded-lg px-4 py-2 transition-colors ${
            filters.length === statusOptions.length
              ? "bg-purple-400 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filters.length === statusOptions.length
            ? "Deselect All"
            : "Select All"}
        </button>

        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => toggleFilter(status)}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filters.includes(status)
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};
