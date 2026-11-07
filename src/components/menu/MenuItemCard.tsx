"use client";
// src/components/menu/MenuItemCard.tsx

import React, { useState } from "react";
import Image from "next/image";
import { MenuItemDTO, ItemVariantDTO } from "@/types";
import { formatGHS } from "@/lib/cart";
import { useCart } from "@/components/cart/CartProvider";
import { DayLockBadge } from "./DayLockBadge";
import { VariantSelector } from "./VariantSelector";
import { cn } from "@/lib/cn";
import { ShoppingCart, Lock, Utensils } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItemDTO;
}

interface CardImageProps {
  name: string;
  imageUrl?: string;
  availableDays: MenuItemDTO["availableDays"];
  isAvailableToday: boolean;
}

function CardImage({
  name,
  imageUrl,
  availableDays,
  isAvailableToday,
}: CardImageProps): React.JSX.Element {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-[4/3] bg-orange-50/60 overflow-hidden">
      {imageUrl && !hasError ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setHasError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-orange-300">
          <Utensils size={32} />
        </div>
      )}

      {availableDays.length > 0 && (
        <div className="absolute top-2.5 right-2.5 z-10 shadow-sm">
          <DayLockBadge availableDays={availableDays} isAvailable={isAvailableToday} />
        </div>
      )}
    </div>
  );
}

export function MenuItemCard({ item }: MenuItemCardProps): React.JSX.Element {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariantDTO>(
    item.variants[0] ?? { id: "", label: "Standard", price: 0 }
  );
  const [added, setAdded] = useState(false);
  const { addItem, toggleDrawer } = useCart();
  const isLocked = !item.isAvailableToday;

  const handleAddToCart = (): void => {
    if (isLocked || !selectedVariant.id) return;
    addItem({
      variantId: selectedVariant.id,
      menuItemName: item.name,
      variantLabel: selectedVariant.label,
      unitPrice: selectedVariant.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toggleDrawer();
  };

  return (
    <div
      className={cn(
        "card group flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md border border-orange-100/80",
        isLocked && "opacity-65"
      )}
    >
      <CardImage
        name={item.name}
        imageUrl={item.imageUrl}
        availableDays={item.availableDays}
        isAvailableToday={item.isAvailableToday}
      />

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug group-hover:text-brand-orange transition-colors">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {item.variants.length > 1 && (
          <VariantSelector
            variants={item.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        <div className="flex items-center justify-between pt-1 mt-auto border-t border-gray-100">
          <span className="text-brand-orange font-bold text-base sm:text-lg">
            {formatGHS(selectedVariant.price)}
          </span>

          {isLocked ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Lock size={13} />
              <span>Locked</span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={cn(
                "flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl transition-all duration-150",
                added
                  ? "bg-green-600 text-white"
                  : "bg-brand-orange text-white hover:bg-orange-600 active:scale-95 shadow-sm shadow-orange-500/20"
              )}
            >
              <ShoppingCart size={14} />
              {added ? "Added!" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
