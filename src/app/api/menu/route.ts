// src/app/api/menu/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isItemAvailableToday } from "@/lib/day-lock";
import { CategoryDTO, MenuItemDTO } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
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

    const now = new Date();

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
    console.error("[GET /api/menu]", err);
    return NextResponse.json(
      { error: "Failed to fetch menu. Please try again." },
      { status: 500 }
    );
  }
}
