// src/app/api/orders/[id]/status/route.ts
// KDS-only endpoint — protected by KDS_SECRET bearer token.

import { NextRequest, NextResponse } from "next/server";
import { OrderStatusUpdateSchema } from "@/schemas/order.schema";
import { prisma } from "@/lib/prisma";
import { broadcastKdsEvent } from "@/lib/pusher";
import { sendOrderStatusSms, OrderStatusMessage } from "@/lib/sms";
import { OrderStatus } from "@prisma/client";

// Valid state machine transitions
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "OUT_FOR_DELIVERY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],
  OUT_FOR_DELIVERY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const SMS_STATUSES = new Set<OrderStatusMessage>([
  "PAID",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
]);

function requireKdsAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("Authorization");
  const kdsSecret = process.env.KDS_SECRET;
  if (!kdsSecret) return false;
  return authHeader === `Bearer ${kdsSecret}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!requireKdsAuth(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body: unknown = await req.json();
  const parsed = OrderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { status: newStatus, note } = parsed.data;

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const allowedNext = ALLOWED_TRANSITIONS[order.status];
  if (!allowedNext.includes(newStatus as OrderStatus)) {
    return NextResponse.json(
      {
        error: `Cannot transition from ${order.status} to ${newStatus}.`,
        allowedTransitions: allowedNext,
      },
      { status: 409 }
    );
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: newStatus as OrderStatus,
      statusHistory: {
        create: [{ status: newStatus as OrderStatus, note }],
      },
    },
  });

  // Broadcast to KDS in real-time
  try {
    await broadcastKdsEvent("order.updated", {
      orderId: updated.id,
      status: updated.status,
      fulfillmentType: updated.fulfillmentType,
      customerPhone: updated.customerPhone,
      totalAmount: updated.totalAmount,
    });
  } catch (err) {
    console.warn("[KDS Pusher] Broadcast failed:", err);
  }

  // Send SMS notification to customer
  if (SMS_STATUSES.has(newStatus as OrderStatusMessage)) {
    try {
      await sendOrderStatusSms(
        updated.customerPhone,
        newStatus as OrderStatusMessage,
        updated.id
      );
    } catch (err) {
      console.warn("[SMS] Notification failed:", err);
    }
  }

  return NextResponse.json({ success: true, status: updated.status });
}
