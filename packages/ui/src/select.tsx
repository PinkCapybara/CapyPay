"use client";
export const Select = ({
  options,
  onSelect,
}: {
  onSelect: (value: string) => void;
  options: {
    id: number;
    key: string;
    value: string;
  }[];
}) => {
  return (
    <select
      onChange={(e) => {
        onSelect(e.target.value);
      }}
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.id} value={option.key}>
          {option.value}
        </option>
      ))}
    </select>
  );
};
