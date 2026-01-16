import { describe, it, expect } from 'vitest';
import {
  validateCartItem,
  validateCart,
  validateOrder,
  isValidStatusTransition,
  canCancelOrder,
  canModifyOrder,
  hasMatchingAllergens,
  filterByDietaryRestrictions,
  getAvailableItems,
  groupItemsByCategory,
} from '../../../src/utils/order';
import { mockMenuItems, mockCartItems, mockOrder } from '../../mocks/data';
import type { CartItem, MenuItem, OrderStatus } from '../../../src/types';

describe('Order Utilities', () => {
  describe('validateCartItem', () => {
    it('validates a valid cart item', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0],
        quantity: 1,
        selectedModifiers: [],
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects unavailable menu item', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[3], // Sold out item
        quantity: 1,
        selectedModifiers: [],
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Sold Out Item is currently unavailable');
    });

    it('rejects quantity less than 1', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0],
        quantity: 0,
        selectedModifiers: [],
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Quantity must be at least 1');
    });

    it('rejects quantity greater than 99', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0],
        quantity: 100,
        selectedModifiers: [],
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Quantity cannot exceed 99');
    });

    it('validates modifiers belong to menu item', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0],
        quantity: 1,
        selectedModifiers: [mockMenuItems[0].modifiers[0]], // Valid modifier
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid modifiers', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0],
        quantity: 1,
        selectedModifiers: [
          { id: 'invalid-mod', name: 'Invalid', price: 1.0, type: 'addon' },
        ],
        specialInstructions: '',
      };
      const result = validateCartItem(item);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid modifier: Invalid');
    });

    it('rejects item without menu item', () => {
      const item = {
        id: 'c1',
        menuItem: null,
        quantity: 1,
        selectedModifiers: [],
        specialInstructions: '',
      } as unknown as CartItem;
      const result = validateCartItem(item);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Menu item is required');
    });
  });

  describe('validateCart', () => {
    it('validates a valid cart', () => {
      const result = validateCart(mockCartItems);
      expect(result.valid).toBe(true);
    });

    it('rejects empty cart', () => {
      const result = validateCart([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Cart is empty');
    });

    it('collects errors from all invalid items', () => {
      const invalidItems: CartItem[] = [
        {
          id: 'c1',
          menuItem: mockMenuItems[3], // Unavailable
          quantity: 1,
          selectedModifiers: [],
          specialInstructions: '',
        },
        {
          id: 'c2',
          menuItem: mockMenuItems[0],
          quantity: 0, // Invalid quantity
          selectedModifiers: [],
          specialInstructions: '',
        },
      ];
      const result = validateCart(invalidItems);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('validateOrder', () => {
    it('validates a valid order', () => {
      const result = validateOrder(mockOrder);
      expect(result.valid).toBe(true);
    });

    it('rejects order without table ID', () => {
      const order = { ...mockOrder, tableId: '' };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Table ID is required');
    });

    it('rejects order with empty items', () => {
      const order = { ...mockOrder, items: [] };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Order must contain at least one item');
    });

    it('rejects negative tip', () => {
      const order = { ...mockOrder, tip: -5 };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tip cannot be negative');
    });
  });

  describe('isValidStatusTransition', () => {
    const testCases: Array<{
      from: OrderStatus;
      to: OrderStatus;
      expected: boolean;
    }> = [
      { from: 'pending', to: 'confirmed', expected: true },
      { from: 'pending', to: 'cancelled', expected: true },
      { from: 'pending', to: 'completed', expected: false },
      { from: 'confirmed', to: 'preparing', expected: true },
      { from: 'confirmed', to: 'pending', expected: false },
      { from: 'preparing', to: 'ready', expected: true },
      { from: 'ready', to: 'delivered', expected: true },
      { from: 'delivered', to: 'completed', expected: true },
      { from: 'completed', to: 'pending', expected: false },
      { from: 'cancelled', to: 'pending', expected: false },
    ];

    testCases.forEach(({ from, to, expected }) => {
      it(`${from} -> ${to} should be ${expected ? 'valid' : 'invalid'}`, () => {
        expect(isValidStatusTransition(from, to)).toBe(expected);
      });
    });
  });

  describe('canCancelOrder', () => {
    it('allows cancellation for pending orders', () => {
      expect(canCancelOrder('pending')).toBe(true);
    });

    it('allows cancellation for confirmed orders', () => {
      expect(canCancelOrder('confirmed')).toBe(true);
    });

    it('allows cancellation for preparing orders', () => {
      expect(canCancelOrder('preparing')).toBe(true);
    });

    it('allows cancellation for ready orders', () => {
      expect(canCancelOrder('ready')).toBe(true);
    });

    it('prevents cancellation for delivered orders', () => {
      expect(canCancelOrder('delivered')).toBe(false);
    });

    it('prevents cancellation for completed orders', () => {
      expect(canCancelOrder('completed')).toBe(false);
    });

    it('prevents cancellation for already cancelled orders', () => {
      expect(canCancelOrder('cancelled')).toBe(false);
    });
  });

  describe('canModifyOrder', () => {
    it('allows modification for pending orders', () => {
      expect(canModifyOrder('pending')).toBe(true);
    });

    it('allows modification for confirmed orders', () => {
      expect(canModifyOrder('confirmed')).toBe(true);
    });

    it('prevents modification for preparing orders', () => {
      expect(canModifyOrder('preparing')).toBe(false);
    });

    it('prevents modification for completed orders', () => {
      expect(canModifyOrder('completed')).toBe(false);
    });
  });

  describe('hasMatchingAllergens', () => {
    it('returns matching allergens', () => {
      const matches = hasMatchingAllergens(mockMenuItems[0], ['gluten', 'soy']);
      expect(matches).toContain('gluten');
      expect(matches).not.toContain('soy');
    });

    it('is case insensitive', () => {
      const matches = hasMatchingAllergens(mockMenuItems[0], ['GLUTEN', 'DAIRY']);
      expect(matches).toHaveLength(2);
    });

    it('returns empty array for no matches', () => {
      const matches = hasMatchingAllergens(mockMenuItems[0], ['nuts', 'shellfish']);
      expect(matches).toHaveLength(0);
    });

    it('handles empty user allergens', () => {
      const matches = hasMatchingAllergens(mockMenuItems[0], []);
      expect(matches).toHaveLength(0);
    });
  });

  describe('filterByDietaryRestrictions', () => {
    it('filters out items with excluded allergens', () => {
      const filtered = filterByDietaryRestrictions(mockMenuItems, ['eggs']);
      // Only Caesar Salad has eggs
      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Caesar Salad' })
      );
    });

    it('returns all items when no exclusions', () => {
      const filtered = filterByDietaryRestrictions(mockMenuItems, []);
      expect(filtered).toHaveLength(mockMenuItems.length);
    });

    it('is case insensitive', () => {
      const filtered = filterByDietaryRestrictions(mockMenuItems, ['EGGS']);
      expect(filtered).not.toContainEqual(
        expect.objectContaining({ name: 'Caesar Salad' })
      );
    });

    it('handles multiple exclusions', () => {
      const filtered = filterByDietaryRestrictions(mockMenuItems, [
        'gluten',
        'dairy',
      ]);
      // Only "Sold Out Item" has no allergens
      expect(filtered).toHaveLength(1);
    });
  });

  describe('getAvailableItems', () => {
    it('filters out unavailable items', () => {
      const available = getAvailableItems(mockMenuItems);
      expect(available).toHaveLength(3); // 4 items, 1 unavailable
      expect(available).not.toContainEqual(
        expect.objectContaining({ name: 'Sold Out Item' })
      );
    });

    it('returns empty array for all unavailable items', () => {
      const allUnavailable = mockMenuItems.map((item) => ({
        ...item,
        available: false,
      }));
      expect(getAvailableItems(allUnavailable)).toHaveLength(0);
    });
  });

  describe('groupItemsByCategory', () => {
    it('groups items by category ID', () => {
      const grouped = groupItemsByCategory(mockMenuItems);
      expect(grouped.get('cat-1')).toHaveLength(2); // Burger + Sold Out
      expect(grouped.get('cat-2')).toHaveLength(1); // Salad
      expect(grouped.get('cat-3')).toHaveLength(1); // Pizza
    });

    it('returns empty map for empty items', () => {
      const grouped = groupItemsByCategory([]);
      expect(grouped.size).toBe(0);
    });
  });
});
