// src/lib/delivery-fee.ts
// Delivery fee calculation. Currently flat-rate; extendable to zone-based.

const BASE_DELIVERY_FEE_PESEWAS =
  parseInt(process.env.DELIVERY_FEE_PESEWAS ?? "2000", 10);

export class DeliveryAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeliveryAddressError";
  }
}

/**
 * Returns the delivery fee in pesewas for a given address.
 * Currently flat-rate (configurable via DELIVERY_FEE_PESEWAS env var).
 *
 * @throws DeliveryAddressError if address is missing or too short.
 */
export function calculateDeliveryFee(address: string | undefined): number {
  if (!address || address.trim().length < 5) {
    throw new DeliveryAddressError(
      "A valid delivery address of at least 5 characters is required."
    );
  }

  return BASE_DELIVERY_FEE_PESEWAS;
}

/** Pickup orders always have zero delivery fee. */
export function pickupDeliveryFee(): number {
  return 0;
}
