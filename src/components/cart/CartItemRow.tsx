"use client";
// src/components/cart/CartItemRow.tsx

import React from "react";
import { CartItem } from "@/types";
import { formatGHS } from "@/lib/cart";
import { useCart } from "./CartProvider";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps): React.JSX.Element {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.menuItemName}</p>
        <p className="text-xs text-gray-400">{item.variantLabel}</p>
        <p className="text-xs text-brand-orange font-semibold">
          {formatGHS(item.unitPrice)}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
          aria-label="Decrease quantity"
          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
          aria-label="Increase quantity"
          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Plus size={12} />
        </button>
        <button
          onClick={() => removeItem(item.variantId)}
          aria-label="Remove item"
          className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-colors ml-1"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
