// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpJwt, JwtError } from "@/lib/jwt";
import { OrderDTO } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Authorization required." }, { status: 401 });
  }

  let customerPhone: string;
  try {
    const payload = await verifyOtpJwt(authHeader.slice(7));
    customerPhone = payload.phone;
  } catch (err) {
    if (err instanceof JwtError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { variant: { include: { menuItem: true } } },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Customers may only view their own orders
  if (order.customerPhone !== customerPhone) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const result: OrderDTO = {
    id: order.id,
    reference: order.reference,
    customerPhone: order.customerPhone,
    customerName: order.customerName,
    fulfillmentType: order.fulfillmentType,
    deliveryAddress: order.deliveryAddress,
    deliveryFee: order.deliveryFee,
    pickupSlot: order.pickupSlot?.toISOString() ?? null,
    status: order.status,
    totalAmount: order.totalAmount,
    paidAt: order.paidAt?.toISOString() ?? null,
    items: order.items.map((item) => ({
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      variantLabel: item.variant.label,
      menuItemName: item.variant.menuItem.name,
    })),
    createdAt: order.createdAt.toISOString(),
  };

  return NextResponse.json(result);
}
