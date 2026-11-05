// src/__tests__/unit/paystack-webhook.test.ts

import crypto from "crypto";
import {
  verifyPaystackSignature,
  isChargeSuccessEvent,
  generateOrderReference,
  PaystackError,
} from "@/lib/paystack";

const MOCK_SECRET = "sk_test_mock_secret_for_unit_tests_1234567890";

function computeValidSignature(body: string, secret: string): string {
  return crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");
}

describe("verifyPaystackSignature", () => {
  beforeEach(() => {
    process.env.PAYSTACK_SECRET_KEY = MOCK_SECRET;
  });

  afterEach(() => {
    delete process.env.PAYSTACK_SECRET_KEY;
  });

  it("returns true for a valid signature", () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "CEPE-123" } });
    const sig = computeValidSignature(body, MOCK_SECRET);
    expect(verifyPaystackSignature(body, sig)).toBe(true);
  });

  it("returns false for a tampered body", () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "CEPE-123" } });
    const sig = computeValidSignature(body, MOCK_SECRET);
    const tamperedBody = JSON.stringify({ event: "charge.success", data: { reference: "CEPE-999" } });
    expect(verifyPaystackSignature(tamperedBody, sig)).toBe(false);
  });

  it("returns false for a wrong signature", () => {
    const body = JSON.stringify({ event: "charge.success" });
    const wrongSig = "a".repeat(128); // 64 hex bytes of 'a'
    expect(verifyPaystackSignature(body, wrongSig)).toBe(false);
  });

  it("throws PaystackError when PAYSTACK_SECRET_KEY is not set", () => {
    delete process.env.PAYSTACK_SECRET_KEY;
    expect(() => verifyPaystackSignature("body", "sig")).toThrow(PaystackError);
  });
});

describe("isChargeSuccessEvent", () => {
  it("returns true for a valid charge.success payload", () => {
    const payload = {
      event: "charge.success",
      data: {
        reference: "CEPE-ABC",
        amount: 8000,
        status: "success",
        paid_at: new Date().toISOString(),
        customer: { phone: "0243799362" },
      },
    };
    expect(isChargeSuccessEvent(payload)).toBe(true);
  });

  it("returns false for a non-charge.success event", () => {
    expect(isChargeSuccessEvent({ event: "charge.failed", data: {} })).toBe(false);
  });

  it("returns false for null", () => {
    expect(isChargeSuccessEvent(null)).toBe(false);
  });

  it("returns false for a string", () => {
    expect(isChargeSuccessEvent("invalid")).toBe(false);
  });

  it("returns false for missing data field", () => {
    expect(isChargeSuccessEvent({ event: "charge.success" })).toBe(false);
  });
});

describe("generateOrderReference", () => {
  it("starts with the CEPE- prefix", () => {
    const ref = generateOrderReference();
    expect(ref).toMatch(/^CEPE-/);
  });

  it("generates unique references on consecutive calls", () => {
    const refs = new Set(Array.from({ length: 100 }, () => generateOrderReference()));
    expect(refs.size).toBe(100);
  });
});
