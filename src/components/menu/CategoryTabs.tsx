"use client";
// src/components/menu/CategoryTabs.tsx

import React, { useRef } from "react";
import { CategoryDTO } from "@/types";
import { cn } from "@/lib/cn";

interface CategoryTabsProps {
  categories: CategoryDTO[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Rice Dishes": "🍚",
  "Loaded Plates": "🍟",
  "Student Saver Menu": "🎓",
  "Snacks & Fast Foods": "🍔",
  Smoothies: "🥤",
  Specials: "⭐",
  Extras: "➕",
};

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
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
              activeCategory === cat.id
                ? "bg-brand-orange text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-brand-orange hover:text-brand-orange"
            )}
          >
            <span>{CATEGORY_ICONS[cat.name] ?? "🍴"}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
