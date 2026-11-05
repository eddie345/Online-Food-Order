"use client";
// src/components/kds/StatusStepper.tsx

import React from "react";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/cn";

interface StatusStepperProps {
  status: OrderStatus;
  isDelivery: boolean;
}

type StepDef = { label: string; status: OrderStatus };

const PICKUP_STEPS: StepDef[] = [
  { label: "Paid", status: "PAID" },
  { label: "Preparing", status: "PREPARING" },
  { label: "Ready", status: "READY" },
  { label: "Done", status: "COMPLETED" },
];

const DELIVERY_STEPS: StepDef[] = [
  { label: "Paid", status: "PAID" },
  { label: "Preparing", status: "PREPARING" },
  { label: "Out", status: "OUT_FOR_DELIVERY" },
  { label: "Done", status: "COMPLETED" },
];

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
];

function statusIndex(s: OrderStatus): number {
  return STATUS_ORDER.indexOf(s);
}

export function StatusStepper({
  status,
  isDelivery,
}: StatusStepperProps): React.JSX.Element {
  const steps = isDelivery ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIdx = statusIndex(status);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const stepIdx = statusIndex(step.status);
        const isDone = currentIdx >= stepIdx;
        const isCurrent = currentIdx === stepIdx;

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  isDone
                    ? "bg-brand-orange border-brand-orange text-white"
                    : "bg-gray-700 border-gray-600 text-gray-500"
                )}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs text-center leading-none",
                  isCurrent ? "text-brand-orange font-medium" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-4 rounded transition-colors",
                  currentIdx > stepIdx ? "bg-brand-orange" : "bg-gray-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
