"use client";
// src/components/cart/CartFab.tsx — Floating action button

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartFab(): React.JSX.Element {
  const { itemCount, toggleDrawer } = useCart();

  if (itemCount === 0) return <></>;

  return (
    <button
      onClick={toggleDrawer}
      aria-label={`Open cart — ${itemCount} items`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-orange text-white
                 font-semibold py-3 px-5 rounded-full shadow-xl hover:bg-orange-600
                 active:scale-95 transition-all duration-150"
    >
      <ShoppingCart size={18} />
      <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
    </button>
  );
}
