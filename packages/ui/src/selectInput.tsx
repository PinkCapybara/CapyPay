"use client";

interface SelectInputProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export const SelectInput = ({
  options,
  value,
  onChange,
  label,
  className = "",
}: SelectInputProps) => {
  return (
    <div className={`pt-2 ${className}`}>
      <label className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
