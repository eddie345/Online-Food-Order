// src/__tests__/unit/cart-calculation.test.ts

import { calculateSubtotal, buildCartSummary, formatGHS } from "@/lib/cart";
import { CartItem } from "@/types";

function makeItem(
  name: string,
  unitPrice: number,
  quantity: number
): CartItem {
  return {
    variantId: `variant-${name}`,
    menuItemName: name,
    variantLabel: "Standard",
    unitPrice,
    quantity,
  };
}

describe("calculateSubtotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("calculates subtotal for a single item", () => {
    const items = [makeItem("Jollof", 8000, 1)]; // GHS 80 × 1
    expect(calculateSubtotal(items)).toBe(8000);
  });

  it("calculates subtotal for multiple items with varying quantities", () => {
    const items = [
      makeItem("Jollof", 8000, 2), // GHS 80 × 2 = 16000
      makeItem("Smoothie", 3000, 3), // GHS 30 × 3 = 9000
    ];
    expect(calculateSubtotal(items)).toBe(25000);
  });

  it("throws for a zero unit price", () => {
    const items = [makeItem("Free Item", 0, 1)];
    expect(() => calculateSubtotal(items)).toThrow(
      /Invalid unit price/
    );
  });

  it("throws for a negative unit price", () => {
    const items = [makeItem("Negative", -100, 1)];
    expect(() => calculateSubtotal(items)).toThrow(
      /Invalid unit price/
    );
  });

  it("throws for a zero quantity", () => {
    const items = [makeItem("Jollof", 8000, 0)];
    expect(() => calculateSubtotal(items)).toThrow(
      /Invalid quantity/
    );
  });

  it("handles pesewa precision correctly (no floating point errors)", () => {
    // 3 × GHS 33.33 = GHS 99.99 → should be exact integer math
    const items = [makeItem("Item", 3333, 3)];
    expect(calculateSubtotal(items)).toBe(9999);
  });
});

describe("buildCartSummary", () => {
  it("builds summary with zero delivery fee for pickup", () => {
    const items = [makeItem("Burger", 7000, 1)];
    const summary = buildCartSummary(items, 0);

    expect(summary.subtotal).toBe(7000);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.total).toBe(7000);
  });

  it("builds summary with delivery fee", () => {
    const items = [makeItem("Burger", 7000, 1)];
    const summary = buildCartSummary(items, 2000); // GHS 20 delivery

    expect(summary.subtotal).toBe(7000);
    expect(summary.deliveryFee).toBe(2000);
    expect(summary.total).toBe(9000);
  });

  it("throws for a negative delivery fee", () => {
    const items = [makeItem("Burger", 7000, 1)];
    expect(() => buildCartSummary(items, -500)).toThrow(
      /Delivery fee cannot be negative/
    );
  });

  it("includes all items in the returned summary", () => {
    const items = [
      makeItem("Jollof", 5000, 2),
      makeItem("Smoothie", 3000, 1),
    ];
    const summary = buildCartSummary(items, 2000);
    expect(summary.items).toHaveLength(2);
    expect(summary.total).toBe(15000); // 10000 + 3000 + 2000
  });
});

describe("formatGHS", () => {
  it("formats pesewas to GHS string", () => {
    expect(formatGHS(8000)).toBe("GHS 80.00");
  });

  it("formats zero correctly", () => {
    expect(formatGHS(0)).toBe("GHS 0.00");
  });

  it("formats fractional GHS (pesewas) correctly", () => {
    expect(formatGHS(50)).toBe("GHS 0.50");
  });

  it("formats large amounts correctly", () => {
    expect(formatGHS(150000)).toBe("GHS 1500.00");
  });
});
