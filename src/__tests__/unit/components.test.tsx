/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DayLockBadge } from "@/components/menu/DayLockBadge";
import { VariantSelector } from "@/components/menu/VariantSelector";
import { FulfillmentToggle } from "@/components/checkout/FulfillmentToggle";
import { DeliveryForm } from "@/components/checkout/DeliveryForm";
import { DayOfWeek } from "@prisma/client";
import { ItemVariantDTO } from "@/types";

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
