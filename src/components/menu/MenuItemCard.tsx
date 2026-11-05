"use client";
// src/components/menu/MenuItemCard.tsx

import React, { useState } from "react";
import { MenuItemDTO, ItemVariantDTO } from "@/types";
import { formatGHS } from "@/lib/cart";
import { useCart } from "@/components/cart/CartProvider";
import { DayLockBadge } from "./DayLockBadge";
import { VariantSelector } from "./VariantSelector";
import { cn } from "@/lib/cn";
import { ShoppingCart, Lock } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItemDTO;
}

export function MenuItemCard({ item }: MenuItemCardProps): React.JSX.Element {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariantDTO>(
    item.variants[0] ?? { id: "", label: "Standard", price: 0 }
  );
  const [added, setAdded] = useState(false);
  const { addItem, toggleDrawer } = useCart();

  const isLocked = !item.isAvailableToday;

  const handleAddToCart = (): void => {
    if (isLocked || !selectedVariant.id) return;

    addItem({
      variantId: selectedVariant.id,
      menuItemName: item.name,
      variantLabel: selectedVariant.label,
      unitPrice: selectedVariant.price,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toggleDrawer();
  };

  return (
    <div
      className={cn(
        "card flex flex-col justify-between p-4 gap-3 transition-opacity",
        isLocked && "opacity-60"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug">{item.name}</h3>
          {item.availableDays.length > 0 && (
            <DayLockBadge availableDays={item.availableDays} isAvailable={item.isAvailableToday} />
          )}
        </div>
        {item.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
        )}
      </div>

      {item.variants.length > 1 && (
        <VariantSelector
          variants={item.variants}
          selected={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      <div className="flex items-center justify-between mt-auto">
        <span className="text-brand-orange font-bold text-base">
          {formatGHS(selectedVariant.price)}
        </span>

        {isLocked ? (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock size={12} />
            <span>Not available today</span>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={cn(
              "flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-xl transition-all duration-150",
              added
                ? "bg-green-500 text-white"
                : "bg-brand-orange text-white hover:bg-orange-600 active:scale-95"
            )}
          >
            <ShoppingCart size={14} />
            {added ? "Added!" : "Add"}
          </button>
        )}
      </div>
    </div>
  );
}
