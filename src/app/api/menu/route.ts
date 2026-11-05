// src/app/api/menu/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isItemAvailableToday } from "@/lib/day-lock";
import { getStaticMenu } from "@/lib/static-menu";
import { CategoryDTO, MenuItemDTO } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const now = new Date();

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isActive: true },
          include: { variants: true },
          orderBy: { name: "asc" },
        },
      },
    });

    if (categories.length === 0) {
      // If DB has not been seeded yet, return the default structured menu
      return NextResponse.json(getStaticMenu(now));
    }

    const result: CategoryDTO[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder,
      items: cat.items.map((item): MenuItemDTO => ({
        id: item.id,
        name: item.name,
        description: item.description,
        categoryId: item.categoryId,
        categoryName: cat.name,
        variants: item.variants.map((v) => ({
          id: v.id,
          label: v.label,
          price: v.price,
        })),
        availableDays: item.availableDays,
        isAvailableToday: isItemAvailableToday(item.availableDays, now),
        isActive: item.isActive,
      })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    // Database connection or table unavailable — fallback seamlessly to static catalog
    console.warn(
      "[GET /api/menu] Database unavailable; serving static catalog:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(getStaticMenu(now));
  }
}
