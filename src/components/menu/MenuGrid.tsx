"use client";
// src/components/menu/MenuGrid.tsx

import React from "react";
import { MenuItemDTO } from "@/types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuGridProps {
  items: MenuItemDTO[];
}

export function MenuGrid({ items }: MenuGridProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🍽️</p>
        <p>No items in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
