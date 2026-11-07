/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DayLockBadge } from "@/components/menu/DayLockBadge";
import { VariantSelector } from "@/components/menu/VariantSelector";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { FulfillmentToggle } from "@/components/checkout/FulfillmentToggle";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { CartProvider } from "@/components/cart/CartProvider";
import { DayOfWeek } from "@prisma/client";
import { ItemVariantDTO, CategoryDTO, MenuItemDTO } from "@/types";

describe("DayLockBadge Component", () => {
  it("renders 'Tuesdays only' badge when available on Tuesday", () => {
    render(
      <DayLockBadge availableDays={[DayOfWeek.TUESDAY]} isAvailable={true} />
    );
    expect(screen.getByText("✓ Tuesdays only")).toBeInTheDocument();
  });

  it("renders locked badge when not available today", () => {
    render(
      <DayLockBadge availableDays={[DayOfWeek.THURSDAY]} isAvailable={false} />
    );
    expect(screen.getByText("🔒 Thursdays only")).toBeInTheDocument();
  });
});

describe("VariantSelector Component", () => {
  const defaultVariant: ItemVariantDTO = {
    id: "var-1",
    label: "250ml",
    price: 3000,
  };
  const secondVariant: ItemVariantDTO = {
    id: "var-2",
    label: "500ml",
    price: 5000,
  };
  const mockVariants: ItemVariantDTO[] = [defaultVariant, secondVariant];

  it("renders all variant options with prices", () => {
    const handleSelect = jest.fn();
    render(
      <VariantSelector
        variants={mockVariants}
        selected={defaultVariant}
        onSelect={handleSelect}
      />
    );

    expect(screen.getByText("250ml · GHS 30.00")).toBeInTheDocument();
    expect(screen.getByText("500ml · GHS 50.00")).toBeInTheDocument();
  });

  it("calls onSelect when a variant is clicked", () => {
    const handleSelect = jest.fn();
    render(
      <VariantSelector
        variants={mockVariants}
        selected={defaultVariant}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText("500ml · GHS 50.00"));
    expect(handleSelect).toHaveBeenCalledWith(secondVariant);
  });
});

describe("CategoryTabs Component with Vector Icons", () => {
  const mockCategories: CategoryDTO[] = [
    { id: "cat-1", name: "Rice Dishes", sortOrder: 1, items: [] },
    { id: "cat-2", name: "Loaded Plates", sortOrder: 2, items: [] },
    { id: "cat-3", name: "Student Saver Menu", sortOrder: 3, items: [] },
  ];

  it("renders all category tab labels", () => {
    const handleSelect = jest.fn();
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="cat-1"
        onSelect={handleSelect}
      />
    );

    expect(screen.getByText("Rice Dishes")).toBeInTheDocument();
    expect(screen.getByText("Loaded Plates")).toBeInTheDocument();
    expect(screen.getByText("Student Saver Menu")).toBeInTheDocument();
  });

  it("triggers onSelect callback when a tab is clicked", () => {
    const handleSelect = jest.fn();
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="cat-1"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText("Loaded Plates"));
    expect(handleSelect).toHaveBeenCalledWith("cat-2");
  });
});

describe("MenuItemCard Component with Food Image", () => {
  const mockItem: MenuItemDTO = {
    id: "item-1",
    name: "Assorted Jollof",
    description: "Classic Ghanaian jollof with rich flavour.",
    categoryId: "cat-1",
    categoryName: "Rice Dishes",
    imageUrl: "https://images.unsplash.com/photo-1662908226065-ef5610ec1f79",
    availableDays: [],
    isAvailableToday: true,
    isActive: true,
    variants: [{ id: "v-1", label: "Standard", price: 8000 }],
  };

  it("renders item card with food image, name, and price", () => {
    render(
      <CartProvider>
        <MenuItemCard item={mockItem} />
      </CartProvider>
    );

    expect(screen.getByText("Assorted Jollof")).toBeInTheDocument();
    expect(screen.getByText("GHS 80.00")).toBeInTheDocument();
    const image = screen.getByRole("img", { name: "Assorted Jollof" });
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toContain(encodeURIComponent("photo-1662908226065"));
  });
});

describe("FulfillmentToggle Component", () => {
  it("renders Self-Pickup and Delivery options", () => {
    const handleChange = jest.fn();
    render(<FulfillmentToggle value="PICKUP" onChange={handleChange} />);

    expect(screen.getByText("Self-Pickup")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  it("calls onChange when delivery option is selected", () => {
    const handleChange = jest.fn();
    render(<FulfillmentToggle value="PICKUP" onChange={handleChange} />);

    fireEvent.click(screen.getByText("Delivery"));
    expect(handleChange).toHaveBeenCalledWith("DELIVERY");
  });
});

describe("DeliveryForm Component", () => {
  it("updates value and shows warning if address is too short", () => {
    const handleChange = jest.fn();
    render(<DeliveryForm value="Acc" onChange={handleChange} />);

    expect(screen.getByPlaceholderText(/Enter your full delivery address/)).toBeInTheDocument();
    expect(screen.getByText("Please enter a full address.")).toBeInTheDocument();
  });
});
