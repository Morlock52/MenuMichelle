import type { CartItem, Modifier } from '../types';

// Tax rate (8% default, can be configured)
export const TAX_RATE = 0.08;

/**
 * Format price as currency string
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculate the total price for modifiers
 */
export function calculateModifiersTotal(modifiers: Modifier[]): number {
  return modifiers.reduce((sum, modifier) => sum + modifier.price, 0);
}

/**
 * Calculate the price for a single cart item (including modifiers and quantity)
 */
export function calculateItemTotal(item: CartItem): number {
  const basePrice = item.menuItem.price;
  const modifiersTotal = calculateModifiersTotal(item.selectedModifiers);
  return (basePrice + modifiersTotal) * item.quantity;
}

/**
 * Calculate subtotal for all cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

/**
 * Calculate tax amount based on subtotal
 */
export function calculateTax(subtotal: number, taxRate: number = TAX_RATE): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

/**
 * Calculate tip amount based on subtotal and percentage
 */
export function calculateTip(subtotal: number, tipPercentage: number): number {
  if (tipPercentage < 0) {
    throw new Error('Tip percentage cannot be negative');
  }
  return Math.round(subtotal * (tipPercentage / 100) * 100) / 100;
}

/**
 * Calculate the total order amount
 */
export function calculateTotal(
  subtotal: number,
  tax: number,
  tip: number = 0,
  discount: number = 0
): number {
  const total = subtotal + tax + tip - discount;
  return Math.max(0, Math.round(total * 100) / 100);
}

/**
 * Calculate loyalty points earned (1 point per dollar spent)
 */
export function calculateLoyaltyPoints(total: number): number {
  return Math.floor(total);
}

/**
 * Calculate discount from loyalty points (100 points = $1)
 */
export function calculateLoyaltyDiscount(points: number): number {
  return Math.floor(points / 100);
}

/**
 * Validate that a price is valid (non-negative, finite number)
 */
export function isValidPrice(price: unknown): price is number {
  return typeof price === 'number' && !isNaN(price) && isFinite(price) && price >= 0;
}
