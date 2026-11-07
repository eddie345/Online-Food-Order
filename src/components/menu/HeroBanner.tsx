"use client";
// src/components/menu/HeroBanner.tsx

import React from "react";
import { Flame, Phone } from "lucide-react";

export function HeroBanner(): React.JSX.Element {
  return (
    <div className="relative bg-brand-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-orange/25" />
      <div className="relative max-w-4xl mx-auto px-6 py-10 flex flex-col gap-2">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-700 flex items-center justify-center shadow-lg shadow-orange-900/30 flex-shrink-0">
            <Flame className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              CEPE Grills &amp; Diner
            </h1>
            <p className="text-orange-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              Good Food · Good Vibes
            </p>
          </div>
        </div>
        <p className="text-gray-300 text-sm max-w-md mt-1 leading-relaxed">
          Fresh Ghanaian meals, quick bites, and refreshing smoothies - delivered to you or ready for pickup.
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Phone size={13} className="text-brand-orange" />
            0243 799 362
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={13} className="text-brand-orange" />
            0545 844 248
          </span>
        </div>
      </div>
    </div>
  );
}
