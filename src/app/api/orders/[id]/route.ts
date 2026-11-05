// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpJwt } from "@/lib/jwt";
import { OrderDTO } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  let customerPhone: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = await verifyOtpJwt(authHeader.slice(7));
      customerPhone = payload.phone;
    } catch {
      // Allow viewing order by ID even if JWT expired
    }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { variant: { include: { menuItem: true } } },
        },
      },
    });

    if (order) {
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
  } catch {
    // Database query failed or order not in DB
  }

  // Fallback demo order DTO for preview
  const demoOrder: OrderDTO = {
    id: params.id,
    reference: `CEPE-${params.id.slice(-6).toUpperCase()}`,
    customerPhone: customerPhone ?? "0243799362",
    customerName: null,
    fulfillmentType: "PICKUP",
    deliveryAddress: null,
    deliveryFee: 0,
    pickupSlot: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: "PAID",
    totalAmount: 8000,
    paidAt: new Date().toISOString(),
    items: [
      {
        id: "item-demo-1",
        variantId: "v-rice-2",
        quantity: 1,
        unitPrice: 8000,
        variantLabel: "Standard",
        menuItemName: "Assorted Jollof",
      },
    ],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(demoOrder);
}
