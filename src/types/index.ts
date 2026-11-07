// src/types/index.ts
// Shared TypeScript types - strictly typed, no `any`

import { DayOfWeek, FulfillmentType, OrderStatus } from "@prisma/client";

export type { DayOfWeek, FulfillmentType, OrderStatus };

export interface ItemVariantDTO {
  id: string;
  label: string;
  price: number; // pesewas
}

export interface MenuItemDTO {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  variants: ItemVariantDTO[];
  availableDays: DayOfWeek[];
  isAvailableToday: boolean;
  isActive: boolean;
  imageUrl?: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  sortOrder: number;
  items: MenuItemDTO[];
}

export interface CartItem {
  variantId: string;
  menuItemName: string;
  variantLabel: string;
  unitPrice: number; // pesewas
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number; // pesewas
  deliveryFee: number; // pesewas
  total: number; // pesewas
}

export interface OrderCreateInput {
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
  }>;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  pickupSlot?: string; // ISO date string
  customerPhone: string;
  customerName?: string;
}

export interface OrderDTO {
  id: string;
  reference: string;
  customerPhone: string;
  customerName: string | null;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string | null;
  deliveryFee: number;
  pickupSlot: string | null;
  status: OrderStatus;
  totalAmount: number;
  paidAt: string | null;
  items: Array<{
    id: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    variantLabel: string;
    menuItemName: string;
  }>;
  createdAt: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackWebhookPayload {
  event: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
    customer: {
      phone: string;
    };
  };
}

export interface OtpSendResult {
  success: boolean;
  message: string;
}

export interface OtpVerifyResult {
  success: boolean;
  token?: string;
  message: string;
}

export type PickupTimeSlot = {
  label: string;
  value: string; // ISO string
};
