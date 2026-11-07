// src/app/api/webhooks/paystack/route.ts
// Receives Paystack charge.success events and marks orders PAID.

import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature, isChargeSuccessEvent } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { broadcastKdsEvent } from "@/lib/pusher";
import { sendOrderStatusSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  // 2. Verify HMAC-SHA512 signature (reject immediately if invalid)
  let isValid: boolean;
  try {
    isValid = verifyPaystackSignature(rawBody, signature);
  } catch {
    return NextResponse.json({ error: "Configuration error." }, { status: 500 });
  }

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  // 3. Parse and type-guard the payload
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // 4. Only handle charge.success events; acknowledge others gracefully
  if (!isChargeSuccessEvent(payload)) {
    return NextResponse.json({ received: true });
  }

  const { reference, amount, paid_at } = payload.data;

  // 5. Find the order
  const order = await prisma.order.findUnique({ where: { reference } });
  if (!order) {
    // Not our order: acknowledge and move on
    return NextResponse.json({ received: true });
  }

  // 6. Idempotency: if already PAID, do nothing
  if (order.status !== "PENDING") {
    return NextResponse.json({ received: true });
  }

  // 7. Validate amount matches (security check against manipulation)
  if (amount !== order.totalAmount) {
    console.error(
      `[Webhook] Amount mismatch for order ${order.id}: expected ${order.totalAmount}, got ${amount}`
    );
    return NextResponse.json({ error: "Amount mismatch." }, { status: 400 });
  }

  // 8. Mark order as PAID
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt: new Date(paid_at),
      statusHistory: {
        create: [{ status: "PAID", note: "Payment confirmed via Paystack webhook" }],
      },
    },
  });

  // 9. Broadcast to KDS
  try {
    await broadcastKdsEvent("order.new", {
      orderId: updated.id,
      status: updated.status,
      fulfillmentType: updated.fulfillmentType,
      customerPhone: updated.customerPhone,
      totalAmount: updated.totalAmount,
    });
  } catch (err) {
    console.warn("[Webhook Pusher] Broadcast failed:", err);
  }

  // 10. SMS confirmation to customer
  try {
    await sendOrderStatusSms(updated.customerPhone, "PAID", updated.id);
  } catch (err) {
    console.warn("[Webhook SMS] Failed:", err);
  }

  return NextResponse.json({ received: true });
}
