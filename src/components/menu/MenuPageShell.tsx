"use client";
// src/components/menu/MenuPageShell.tsx

import React, { useEffect, useState } from "react";
import { CategoryDTO } from "@/types";
import { CategoryTabs } from "./CategoryTabs";
import { MenuGrid } from "./MenuGrid";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFab } from "@/components/cart/CartFab";
import { HeroBanner } from "./HeroBanner";

export function MenuPageShell(): React.JSX.Element {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async (): Promise<void> => {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to load menu");
        const data = (await res.json()) as CategoryDTO[];
        setCategories(data);
        if (data.length > 0 && data[0]) {
          setActiveCategory(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Loading menu…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeItems =
    categories.find((c) => c.id === activeCategory)?.items ?? [];

  return (
    <div className="min-h-screen bg-brand-cream">
      <HeroBanner />

      <div className="max-w-4xl mx-auto px-4 pb-32">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <MenuGrid items={activeItems} />
      </div>

      <CartFab />
      <CartDrawer />
    </div>
  );
}
