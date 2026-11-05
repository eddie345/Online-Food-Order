// src/schemas/order.schema.ts
import { z } from "zod";

export const FulfillmentTypeSchema = z.enum(["DELIVERY", "PICKUP"]);

export const OrderItemInputSchema = z.object({
  variantId: z.string().cuid({ message: "Invalid variant ID" }),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(20, "Quantity too large"),
  unitPrice: z
    .number()
    .int()
    .positive("Unit price must be a positive integer (pesewas)"),
});

export const OrderCreateSchema = z
  .object({
    items: z
      .array(OrderItemInputSchema)
      .min(1, "At least one item is required"),
    fulfillmentType: FulfillmentTypeSchema,
    deliveryAddress: z.string().min(5).max(300).optional(),
    pickupSlot: z.string().datetime({ offset: true }).optional(),
    customerPhone: z
      .string()
      .regex(/^0\d{9}$/, "Phone must be a valid 10-digit Ghanaian number"),
    customerName: z.string().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.fulfillmentType === "DELIVERY" && !data.deliveryAddress) {
        return false;
      }
      return true;
    },
    {
      message: "Delivery address is required for delivery orders",
      path: ["deliveryAddress"],
    }
  )
  .refine(
    (data) => {
      if (data.fulfillmentType === "PICKUP" && !data.pickupSlot) {
        return false;
      }
      return true;
    },
    {
      message: "Pickup time slot is required for pickup orders",
      path: ["pickupSlot"],
    }
  );

export const OrderStatusUpdateSchema = z.object({
  status: z.enum([
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
  note: z.string().max(500).optional(),
});

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;
