"use client";
// src/components/checkout/DeliveryForm.tsx

import React from "react";
import { MapPin } from "lucide-react";

interface DeliveryFormProps {
  value: string;
  onChange: (v: string) => void;
}

export function DeliveryForm({ value, onChange }: DeliveryFormProps): React.JSX.Element {
  return (
    <div className="card p-5 space-y-3">
      <h2 className="font-bold text-base">Delivery Address</h2>
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-3.5 text-gray-400"
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your full delivery address…"
          rows={3}
          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                     focus:outline-none focus:border-brand-orange transition-colors resize-none"
        />
      </div>
      {value.length > 0 && value.trim().length < 5 && (
        <p className="text-xs text-red-400">Please enter a full address.</p>
      )}
    </div>
  );
}
