// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OrderCreateSchema } from "@/schemas/order.schema";
import { prisma } from "@/lib/prisma";
import { verifyOtpJwt, JwtError } from "@/lib/jwt";
import {
  initializePaystackTransaction,
  generateOrderReference,
  PaystackError,
} from "@/lib/paystack";
import { calculateDeliveryFee, pickupDeliveryFee } from "@/lib/delivery-fee";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Authenticate: require valid OTP JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization token required." },
      { status: 401 }
    );
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

  // 2. Validate request body
  const body: unknown = await req.json();
  const parsed = OrderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 3. Validate that variantIds exist and fetch prices
  const variantIds = data.items.map((i) => i.variantId);
  const variants = await prisma.itemVariant.findMany({
    where: { id: { in: variantIds } },
    include: { menuItem: true },
  });

  if (variants.length !== variantIds.length) {
    return NextResponse.json(
      { error: "One or more items are not available." },
      { status: 422 }
    );
  }

  // 4. Use server-side prices (never trust client-sent prices)
  const serverItems = data.items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) throw new Error("Variant not found during price lookup");
    return {
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: variant.price, // authoritative server price
    };
  });

  // 5. Calculate totals
  const subtotal = serverItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  const deliveryFee =
    data.fulfillmentType === "DELIVERY"
      ? calculateDeliveryFee(data.deliveryAddress)
      : pickupDeliveryFee();

  const totalAmount = subtotal + deliveryFee;

  // 6. Create order in DB
  const reference = generateOrderReference();

  const order = await prisma.order.create({
    data: {
      reference,
      customerPhone,
      customerName: data.customerName,
      fulfillmentType: data.fulfillmentType,
      deliveryAddress: data.deliveryAddress,
      deliveryFee,
      pickupSlot: data.pickupSlot ? new Date(data.pickupSlot) : undefined,
      totalAmount,
      items: {
        create: serverItems,
      },
      statusHistory: {
        create: [{ status: "PENDING", note: "Order created" }],
      },
    },
  });

  // 7. Initialize Paystack transaction
  try {
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}`;
    const paystackResult = await initializePaystackTransaction(
      totalAmount,
      `${customerPhone}@cepe-grills.gh`,
      reference,
      callbackUrl
    );

    return NextResponse.json({
      orderId: order.id,
      reference: order.reference,
      paymentUrl: paystackResult.data.authorization_url,
      totalAmount,
    });
  } catch (err) {
    if (err instanceof PaystackError) {
      // Clean up the pending order if Paystack fails
      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { error: "Payment initialization failed. Please try again." },
        { status: 502 }
      );
    }
    throw err;
  }
}
