"use client";
// src/components/menu/VariantSelector.tsx

import React from "react";
import { ItemVariantDTO } from "@/types";
import { formatGHS } from "@/lib/cart";
import { cn } from "@/lib/cn";

interface VariantSelectorProps {
  variants: ItemVariantDTO[];
  selected: ItemVariantDTO;
  onSelect: (variant: ItemVariantDTO) => void;
}

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-1.5">
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v)}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-100",
            selected.id === v.id
              ? "bg-brand-orange text-white border-brand-orange"
              : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange"
          )}
        >
          {v.label} · {formatGHS(v.price)}
        </button>
      ))}
    </div>
  );
}
