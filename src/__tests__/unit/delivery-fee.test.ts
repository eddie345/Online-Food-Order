// src/__tests__/unit/delivery-fee.test.ts

import {
  calculateDeliveryFee,
  pickupDeliveryFee,
  DeliveryAddressError,
} from "@/lib/delivery-fee";

describe("calculateDeliveryFee", () => {
  it("returns the base delivery fee for a valid address", () => {
    const fee = calculateDeliveryFee("123 Main Street, Accra");
    expect(fee).toBeGreaterThan(0);
    expect(typeof fee).toBe("number");
  });

  it("returns an integer (no floating point)", () => {
    const fee = calculateDeliveryFee("456 Some Address, Kumasi");
    expect(Number.isInteger(fee)).toBe(true);
  });

  it("throws DeliveryAddressError for undefined address", () => {
    expect(() => calculateDeliveryFee(undefined)).toThrow(DeliveryAddressError);
  });

  it("throws DeliveryAddressError for empty string", () => {
    expect(() => calculateDeliveryFee("")).toThrow(DeliveryAddressError);
  });

  it("throws DeliveryAddressError for whitespace-only address", () => {
    expect(() => calculateDeliveryFee("   ")).toThrow(DeliveryAddressError);
  });

  it("throws DeliveryAddressError for address shorter than 5 chars", () => {
    expect(() => calculateDeliveryFee("Acc")).toThrow(DeliveryAddressError);
  });

  it("accepts an address of exactly 5 characters", () => {
    expect(() => calculateDeliveryFee("Accra")).not.toThrow();
  });
});

describe("pickupDeliveryFee", () => {
  it("always returns 0", () => {
    expect(pickupDeliveryFee()).toBe(0);
  });
});
