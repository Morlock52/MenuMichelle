import type { CartItem, MenuItem, Order, OrderStatus } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valid order status transitions
 */
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

/**
 * Validate a cart item before adding to order
 */
export function validateCartItem(item: CartItem): ValidationResult {
  const errors: string[] = [];

  if (!item.menuItem) {
    errors.push('Menu item is required');
    return { valid: false, errors };
  }

  if (!item.menuItem.available) {
    errors.push(`${item.menuItem.name} is currently unavailable`);
  }

  if (item.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }

  if (item.quantity > 99) {
    errors.push('Quantity cannot exceed 99');
  }

  // Validate modifiers belong to the menu item
  const validModifierIds = new Set(item.menuItem.modifiers.map((m) => m.id));
  for (const modifier of item.selectedModifiers) {
    if (!validModifierIds.has(modifier.id)) {
      errors.push(`Invalid modifier: ${modifier.name}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate all items in a cart
 */
export function validateCart(items: CartItem[]): ValidationResult {
  const errors: string[] = [];

  if (items.length === 0) {
    errors.push('Cart is empty');
    return { valid: false, errors };
  }

  for (const item of items) {
    const itemValidation = validateCartItem(item);
    errors.push(...itemValidation.errors);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate order before submission
 */
export function validateOrder(order: Partial<Order>): ValidationResult {
  const errors: string[] = [];

  if (!order.tableId) {
    errors.push('Table ID is required');
  }

  if (!order.items || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  } else {
    const cartValidation = validateCart(order.items);
    errors.push(...cartValidation.errors);
  }

  if (order.tip !== undefined && order.tip < 0) {
    errors.push('Tip cannot be negative');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if an order status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Check if an order can be cancelled
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return ['pending', 'confirmed', 'preparing', 'ready'].includes(status);
}

/**
 * Check if an order can be modified
 */
export function canModifyOrder(status: OrderStatus): boolean {
  return ['pending', 'confirmed'].includes(status);
}

/**
 * Check if an item has allergens that match user's allergies
 */
export function hasMatchingAllergens(
  item: MenuItem,
  userAllergens: string[]
): string[] {
  const normalizedUserAllergens = userAllergens.map((a) => a.toLowerCase());
  return item.allergens.filter((allergen) =>
    normalizedUserAllergens.includes(allergen.toLowerCase())
  );
}

/**
 * Filter menu items by dietary restrictions
 */
export function filterByDietaryRestrictions(
  items: MenuItem[],
  excludeAllergens: string[]
): MenuItem[] {
  if (excludeAllergens.length === 0) return items;

  const normalizedExclusions = excludeAllergens.map((a) => a.toLowerCase());
  return items.filter((item) =>
    !item.allergens.some((allergen) =>
      normalizedExclusions.includes(allergen.toLowerCase())
    )
  );
}

/**
 * Get available items only
 */
export function getAvailableItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => item.available);
}

/**
 * Group items by category
 */
export function groupItemsByCategory(
  items: MenuItem[]
): Map<string, MenuItem[]> {
  const grouped = new Map<string, MenuItem[]>();

  for (const item of items) {
    const existing = grouped.get(item.categoryId) || [];
    grouped.set(item.categoryId, [...existing, item]);
  }

  return grouped;
}
