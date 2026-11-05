"use client";
// src/components/cart/CartDrawer.tsx

import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartItemRow } from "./CartItemRow";
import { formatGHS } from "@/lib/cart";
import Link from "next/link";

export function CartDrawer(): React.JSX.Element {
  const { isOpen, items, summary, closeDrawer } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl
                    flex flex-col transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-orange" />
            Your Order
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <p className="text-5xl">🍽️</p>
              <p>Your cart is empty.</p>
              <p className="text-sm">Add items from the menu above!</p>
            </div>
          ) : (
            items.map((item) => <CartItemRow key={item.variantId} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatGHS(summary.subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-brand-orange">{formatGHS(summary.total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
