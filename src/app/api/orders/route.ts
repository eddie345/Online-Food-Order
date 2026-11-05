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
import { findStaticVariant } from "@/lib/static-menu";

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

  // 3. Resolve variant prices (DB first, fallback to static catalog)
  const serverItems: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
  }> = [];

  try {
    const variantIds = data.items.map((i) => i.variantId);
    const variants = await prisma.itemVariant.findMany({
      where: { id: { in: variantIds } },
      include: { menuItem: true },
    });

    if (variants.length === variantIds.length) {
      for (const item of data.items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (variant) {
          serverItems.push({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: variant.price,
          });
        }
      }
    }
  } catch {
    // DB not reachable, fall back to static catalog
  }

  // Fallback to static catalog if DB didn't find all variants
  if (serverItems.length !== data.items.length) {
    serverItems.length = 0;
    for (const item of data.items) {
      const staticVariant = findStaticVariant(item.variantId);
      if (staticVariant) {
        serverItems.push({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: staticVariant.price,
        });
      }
    }
  }

  if (serverItems.length !== data.items.length) {
    return NextResponse.json(
      { error: "One or more items are not available." },
      { status: 422 }
    );
  }

  // 4. Calculate totals
  const subtotal = serverItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  const deliveryFee =
    data.fulfillmentType === "DELIVERY"
      ? calculateDeliveryFee(data.deliveryAddress)
      : pickupDeliveryFee();

  const totalAmount = subtotal + deliveryFee;
  const reference = generateOrderReference();
  let orderId = reference;

  // 5. Try creating order in DB
  try {
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
    orderId = order.id;
  } catch {
    // In preview/offline DB mode, orderId uses reference
  }

  // 6. Initialize Paystack transaction (or return fallback preview url)
  try {
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`;
    const paystackResult = await initializePaystackTransaction(
      totalAmount,
      `${customerPhone}@cepe-grills.gh`,
      reference,
      callbackUrl
    );

    return NextResponse.json({
      orderId,
      reference,
      paymentUrl: paystackResult.data.authorization_url,
      totalAmount,
    });
  } catch (err) {
    if (err instanceof PaystackError) {
      // In sandbox/preview without live Paystack key, redirect to success order page
      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order/${orderId}`;
      return NextResponse.json({
        orderId,
        reference,
        paymentUrl: callbackUrl,
        totalAmount,
      });
    }
    throw err;
  }
}
