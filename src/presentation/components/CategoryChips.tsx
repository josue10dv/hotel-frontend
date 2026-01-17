interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
}: CategoryChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

