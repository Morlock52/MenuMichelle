import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  calculateModifiersTotal,
  calculateItemTotal,
  calculateSubtotal,
  calculateTax,
  calculateTip,
  calculateTotal,
  calculateLoyaltyPoints,
  calculateLoyaltyDiscount,
  isValidPrice,
  TAX_RATE,
} from '../../../src/utils/price';
import { mockCartItems, mockMenuItems } from '../../mocks/data';
import type { CartItem, Modifier } from '../../../src/types';

describe('Price Utilities', () => {
  describe('formatPrice', () => {
    it('formats positive amounts correctly', () => {
      expect(formatPrice(12.99)).toBe('$12.99');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(0.5)).toBe('$0.50');
    });

    it('formats zero correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('handles large amounts', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });

    it('rounds to two decimal places', () => {
      expect(formatPrice(12.999)).toBe('$13.00');
      expect(formatPrice(12.994)).toBe('$12.99');
    });
  });

  describe('calculateModifiersTotal', () => {
    it('returns 0 for empty modifiers array', () => {
      expect(calculateModifiersTotal([])).toBe(0);
    });

    it('calculates total for single modifier', () => {
      const modifiers: Modifier[] = [{ id: 'm1', name: 'Cheese', price: 1.5, type: 'addon' }];
      expect(calculateModifiersTotal(modifiers)).toBe(1.5);
    });

    it('calculates total for multiple modifiers', () => {
      const modifiers: Modifier[] = [
        { id: 'm1', name: 'Cheese', price: 1.5, type: 'addon' },
        { id: 'm2', name: 'Bacon', price: 2.0, type: 'addon' },
        { id: 'm3', name: 'Large Size', price: 3.0, type: 'size' },
      ];
      expect(calculateModifiersTotal(modifiers)).toBe(6.5);
    });
  });

  describe('calculateItemTotal', () => {
    it('calculates total for item without modifiers', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[2], // Pizza at $14.99
        quantity: 1,
        selectedModifiers: [],
        specialInstructions: '',
      };
      expect(calculateItemTotal(item)).toBe(14.99);
    });

    it('calculates total with modifiers', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0], // Burger at $12.99
        quantity: 1,
        selectedModifiers: [{ id: 'm1', name: 'Cheese', price: 1.5, type: 'addon' }],
        specialInstructions: '',
      };
      expect(calculateItemTotal(item)).toBe(14.49);
    });

    it('multiplies by quantity correctly', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0], // Burger at $12.99
        quantity: 3,
        selectedModifiers: [],
        specialInstructions: '',
      };
      expect(calculateItemTotal(item)).toBe(38.97);
    });

    it('handles quantity and modifiers together', () => {
      const item: CartItem = {
        id: 'c1',
        menuItem: mockMenuItems[0], // Burger at $12.99
        quantity: 2,
        selectedModifiers: [
          { id: 'm1', name: 'Cheese', price: 1.5, type: 'addon' },
          { id: 'm2', name: 'Bacon', price: 2.0, type: 'addon' },
        ],
        specialInstructions: '',
      };
      // (12.99 + 1.5 + 2.0) * 2 = 32.98
      expect(calculateItemTotal(item)).toBe(32.98);
    });
  });

  describe('calculateSubtotal', () => {
    it('returns 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('calculates subtotal for single item', () => {
      const items: CartItem[] = [
        {
          id: 'c1',
          menuItem: mockMenuItems[2],
          quantity: 1,
          selectedModifiers: [],
          specialInstructions: '',
        },
      ];
      expect(calculateSubtotal(items)).toBe(14.99);
    });

    it('calculates subtotal for multiple items', () => {
      // Using mockCartItems: 2 burgers with cheese ($14.49 * 2) + 1 salad ($9.99)
      // = $28.98 + $9.99 = $38.97
      expect(calculateSubtotal(mockCartItems)).toBeCloseTo(38.97, 2);
    });
  });

  describe('calculateTax', () => {
    it('calculates tax at default rate', () => {
      expect(calculateTax(100)).toBe(8.0);
    });

    it('calculates tax with custom rate', () => {
      expect(calculateTax(100, 0.1)).toBe(10.0);
    });

    it('rounds to two decimal places', () => {
      expect(calculateTax(33.33)).toBe(2.67);
    });

    it('handles zero subtotal', () => {
      expect(calculateTax(0)).toBe(0);
    });
  });

  describe('calculateTip', () => {
    it('calculates 15% tip', () => {
      expect(calculateTip(100, 15)).toBe(15.0);
    });

    it('calculates 20% tip', () => {
      expect(calculateTip(50, 20)).toBe(10.0);
    });

    it('handles 0% tip', () => {
      expect(calculateTip(100, 0)).toBe(0);
    });

    it('throws error for negative tip percentage', () => {
      expect(() => calculateTip(100, -10)).toThrow('Tip percentage cannot be negative');
    });

    it('rounds to two decimal places', () => {
      expect(calculateTip(33.33, 18)).toBe(6.0);
    });
  });

  describe('calculateTotal', () => {
    it('calculates total without tip or discount', () => {
      expect(calculateTotal(100, 8)).toBe(108.0);
    });

    it('includes tip in total', () => {
      expect(calculateTotal(100, 8, 15)).toBe(123.0);
    });

    it('subtracts discount from total', () => {
      expect(calculateTotal(100, 8, 15, 10)).toBe(113.0);
    });

    it('never returns negative total', () => {
      expect(calculateTotal(10, 1, 0, 100)).toBe(0);
    });

    it('rounds to two decimal places', () => {
      expect(calculateTotal(33.33, 2.67, 5.55)).toBe(41.55);
    });
  });

  describe('calculateLoyaltyPoints', () => {
    it('awards 1 point per dollar', () => {
      expect(calculateLoyaltyPoints(50)).toBe(50);
    });

    it('floors decimal amounts', () => {
      expect(calculateLoyaltyPoints(50.99)).toBe(50);
    });

    it('handles zero total', () => {
      expect(calculateLoyaltyPoints(0)).toBe(0);
    });
  });

  describe('calculateLoyaltyDiscount', () => {
    it('converts 100 points to $1', () => {
      expect(calculateLoyaltyDiscount(100)).toBe(1);
    });

    it('floors partial discounts', () => {
      expect(calculateLoyaltyDiscount(250)).toBe(2);
    });

    it('handles points less than 100', () => {
      expect(calculateLoyaltyDiscount(50)).toBe(0);
    });
  });

  describe('isValidPrice', () => {
    it('returns true for valid prices', () => {
      expect(isValidPrice(10.99)).toBe(true);
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(1000000)).toBe(true);
    });

    it('returns false for negative numbers', () => {
      expect(isValidPrice(-5)).toBe(false);
    });

    it('returns false for NaN', () => {
      expect(isValidPrice(NaN)).toBe(false);
    });

    it('returns false for Infinity', () => {
      expect(isValidPrice(Infinity)).toBe(false);
      expect(isValidPrice(-Infinity)).toBe(false);
    });

    it('returns false for non-numbers', () => {
      expect(isValidPrice('10.99')).toBe(false);
      expect(isValidPrice(null)).toBe(false);
      expect(isValidPrice(undefined)).toBe(false);
      expect(isValidPrice({})).toBe(false);
    });
  });

  describe('TAX_RATE constant', () => {
    it('is set to 8%', () => {
      expect(TAX_RATE).toBe(0.08);
    });
  });
});
