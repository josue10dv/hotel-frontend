import { memo } from "react";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategoryChips = memo(function CategoryChips({
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
                  ? "bg-primary text-secondary shadow-md border border-primary transform scale-105"
                  : "bg-white text-app-text hover:bg-app-background border border-gray-200 hover:border-secondary"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
});

export default CategoryChips;

