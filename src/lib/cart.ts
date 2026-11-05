// src/lib/cart.ts
// Pure cart calculation logic. No I/O, no side effects.

import { CartItem, CartSummary } from "@/types";

/**
 * Calculates the subtotal of all cart items in pesewas.
 * Throws if any item has a non-positive price or quantity.
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    if (item.unitPrice <= 0) {
      throw new Error(
        `Invalid unit price for item "${item.menuItemName}": ${item.unitPrice}`
      );
    }
    if (item.quantity <= 0) {
      throw new Error(
        `Invalid quantity for item "${item.menuItemName}": ${item.quantity}`
      );
    }
    return sum + item.unitPrice * item.quantity;
  }, 0);
}

/**
 * Builds a full CartSummary including delivery fee and total.
 *
 * @param items       - Cart items with pesewa unit prices
 * @param deliveryFee - Fee in pesewas (0 for pickup)
 */
export function buildCartSummary(
  items: CartItem[],
  deliveryFee: number
): CartSummary {
  if (deliveryFee < 0) {
    throw new Error(`Delivery fee cannot be negative: ${deliveryFee}`);
  }

  const subtotal = calculateSubtotal(items);

  return {
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

/**
 * Formats a pesewa integer as a GHS currency string.
 * e.g. 8000 → "GHS 80.00"
 */
export function formatGHS(pesewas: number): string {
  return `GHS ${(pesewas / 100).toFixed(2)}`;
}
