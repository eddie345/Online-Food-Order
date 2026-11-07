// src/lib/paystack.ts
// Paystack API wrapper: no hardcoded secrets, full type safety.

import crypto from "crypto";
import { PaystackInitResponse, PaystackWebhookPayload } from "@/types";

export class PaystackError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "PaystackError";
  }
}

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new PaystackError("PAYSTACK_SECRET_KEY environment variable is not set.");
  }
  return key;
}

/**
 * Initializes a Paystack transaction.
 *
 * @param amountPesewas - Total in pesewas (Paystack uses kobo for NGN, pesewas for GHS)
 * @param email         - Customer email (Paystack requires email; we derive from phone)
 * @param reference     - Unique order reference
 * @param callbackUrl   - URL Paystack redirects to after payment
 */
export async function initializePaystackTransaction(
  amountPesewas: number,
  email: string,
  reference: string,
  callbackUrl: string
): Promise<PaystackInitResponse> {
  const secretKey = getSecretKey();

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPesewas,
      email,
      reference,
      callback_url: callbackUrl,
      currency: "GHS",
    }),
  });

  if (!response.ok) {
    throw new PaystackError(
      `Paystack initialization failed: ${response.statusText}`,
      response.status
    );
  }

  const data = (await response.json()) as PaystackInitResponse;

  if (!data.status) {
    throw new PaystackError(`Paystack error: ${data.message}`);
  }

  return data;
}

/**
 * Verifies a Paystack webhook signature using HMAC-SHA512.
 * Returns true only if the signature matches.
 */
export function verifyPaystackSignature(
  rawBody: string,
  signature: string
): boolean {
  const secretKey = getSecretKey();

  const expectedHash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, "hex"),
    Buffer.from(signature, "hex")
  );
}

/**
 * Type guard to validate that a webhook payload is a charge.success event.
 */
export function isChargeSuccessEvent(
  payload: unknown
): payload is PaystackWebhookPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    p["event"] === "charge.success" &&
    typeof p["data"] === "object" &&
    p["data"] !== null
  );
}

/**
 * Generates a unique order reference with a CEPE prefix.
 */
export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CEPE-${timestamp}-${random}`;
}
