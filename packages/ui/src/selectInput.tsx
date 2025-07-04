"use client"

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
  className = ""
}: SelectInputProps) => {
  return (
    <div className={`pt-2 ${className}`}>
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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