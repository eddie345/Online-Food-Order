"use client";
// src/components/menu/CategoryTabs.tsx

import React, { useRef } from "react";
import { CategoryDTO } from "@/types";
import { cn } from "@/lib/cn";
import {
  Soup,
  Flame,
  BadgePercent,
  Sandwich,
  CupSoda,
  Sparkles,
  PlusCircle,
  Utensils,
} from "lucide-react";

interface CategoryTabsProps {
  categories: CategoryDTO[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

function renderCategoryIcon(categoryName: string): React.JSX.Element {
  const iconProps = { size: 16, className: "flex-shrink-0" };

  switch (categoryName) {
    case "Rice Dishes":
      return <Soup {...iconProps} />;
    case "Loaded Plates":
      return <Flame {...iconProps} />;
    case "Student Saver Menu":
      return <BadgePercent {...iconProps} />;
    case "Snacks & Fast Foods":
      return <Sandwich {...iconProps} />;
    case "Smoothies":
      return <CupSoda {...iconProps} />;
    case "Specials":
      return <Sparkles {...iconProps} />;
    case "Extras":
      return <PlusCircle {...iconProps} />;
    default:
      return <Utensils {...iconProps} />;
  }
}

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0 z-10 bg-brand-cream/95 backdrop-blur-sm py-4 -mx-4 px-4">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-brand-orange text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-brand-orange hover:text-brand-orange"
              )}
            >
              {renderCategoryIcon(cat.name)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
