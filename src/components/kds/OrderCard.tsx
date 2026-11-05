"use client";
// src/components/kds/OrderCard.tsx

import React from "react";
import { OrderStatus } from "@prisma/client";
import { formatGHS } from "@/lib/cart";
import { StatusStepper } from "./StatusStepper";

interface KdsOrderCardProps {
  order: {
    orderId: string;
    status: OrderStatus;
    fulfillmentType: string;
    customerPhone: string;
    totalAmount: number;
    receivedAt: Date;
  };
  onStatusUpdate: (newStatus: string) => void;
}

const NEXT_STATUS: Partial<Record<OrderStatus, string>> = {
  PAID: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
  OUT_FOR_DELIVERY: "COMPLETED",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PAID: "Start Preparing",
  PREPARING: "Mark Ready",
  READY: "Mark Completed",
  OUT_FOR_DELIVERY: "Mark Delivered",
};

export function OrderCard({
  order,
  onStatusUpdate,
}: KdsOrderCardProps): React.JSX.Element {
  const nextStatus = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];

  const isDelivery = order.fulfillmentType === "DELIVERY";
  const timeAgo = Math.round(
    (Date.now() - new Date(order.receivedAt).getTime()) / 60000
  );

  return (
    <div className="bg-gray-800 rounded-2xl p-5 space-y-4 border border-gray-700">
      {/* Order header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gray-400">
              #{order.orderId.slice(-6).toUpperCase()}
            </span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                isDelivery
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {isDelivery ? "🛵 Delivery" : "🏪 Pickup"}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1">{order.customerPhone}</p>
        </div>
        <div className="text-right">
          <p className="text-brand-orange font-bold">
            {formatGHS(order.totalAmount)}
          </p>
          <p className="text-gray-500 text-xs">{timeAgo}m ago</p>
        </div>
      </div>

      {/* Status stepper */}
      <StatusStepper status={order.status} isDelivery={isDelivery} />

      {/* Action button */}
      {nextStatus && nextLabel && (
        <button
          onClick={() => onStatusUpdate(nextStatus)}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-orange text-white
                     font-semibold text-sm hover:bg-orange-600 active:scale-95
                     transition-all duration-150"
        >
          {nextLabel} →
        </button>
      )}

      {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
        <div
          className={`text-center text-sm font-medium py-2 rounded-xl ${
            order.status === "COMPLETED"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {order.status === "COMPLETED" ? "✓ Completed" : "✕ Cancelled"}
        </div>
      )}
    </div>
  );
}
