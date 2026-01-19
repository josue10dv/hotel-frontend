import { memo } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = memo(function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        className="w-full h-14 pl-6 pr-14 bg-white border border-gray-200 rounded-2xl shadow-sm text-lg text-app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
        placeholder="Buscar hoteles, ciudades, países..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
});

export default SearchBar;

