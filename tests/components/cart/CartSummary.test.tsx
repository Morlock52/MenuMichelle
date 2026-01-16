import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { CartSummary } from '../../../src/components/cart/CartSummary';
import { mockCartItems, mockMenuItems } from '../../mocks/data';
import type { CartItem } from '../../../src/types';

describe('CartSummary Component', () => {
  describe('Empty Cart', () => {
    it('displays empty cart message when no items', () => {
      render(<CartSummary items={[]} />);
      expect(screen.getByTestId('empty-cart-message')).toHaveTextContent(
        'Your cart is empty'
      );
    });

    it('does not show totals section when empty', () => {
      render(<CartSummary items={[]} />);
      expect(screen.queryByTestId('cart-totals')).not.toBeInTheDocument();
    });
  });

  describe('Cart with Items', () => {
    it('renders all cart items', () => {
      render(<CartSummary items={mockCartItems} />);
      const items = screen.getAllByTestId('cart-item');
      expect(items).toHaveLength(mockCartItems.length);
    });

    it('displays item names with quantities', () => {
      render(<CartSummary items={mockCartItems} />);
      expect(screen.getByText(/2x Classic Burger/)).toBeInTheDocument();
      expect(screen.getByText(/1x Caesar Salad/)).toBeInTheDocument();
    });

    it('displays modifiers when present', () => {
      render(<CartSummary items={mockCartItems} />);
      const modifiers = screen.getByTestId('item-modifiers');
      expect(modifiers).toBeInTheDocument();
      expect(modifiers).toHaveTextContent('Add Cheese');
    });

    it('displays special instructions when present', () => {
      render(<CartSummary items={mockCartItems} />);
      expect(screen.getByTestId('special-instructions')).toHaveTextContent(
        'No onions please'
      );
    });
  });

  describe('Pricing Display', () => {
    it('displays correct subtotal', () => {
      const simpleItem: CartItem[] = [
        {
          id: 'c1',
          menuItem: mockMenuItems[2], // Pizza at $14.99
          quantity: 2,
          selectedModifiers: [],
          specialInstructions: '',
        },
      ];
      render(<CartSummary items={simpleItem} />);
      expect(screen.getByTestId('subtotal')).toHaveTextContent('$29.98');
    });

    it('displays tax amount', () => {
      const simpleItem: CartItem[] = [
        {
          id: 'c1',
          menuItem: { ...mockMenuItems[0], price: 100 },
          quantity: 1,
          selectedModifiers: [],
          specialInstructions: '',
        },
      ];
      render(<CartSummary items={simpleItem} />);
      expect(screen.getByTestId('tax')).toHaveTextContent('$8.00');
    });

    it('displays tip when provided', () => {
      render(<CartSummary items={mockCartItems} tip={5.0} />);
      expect(screen.getByTestId('tip')).toHaveTextContent('$5.00');
    });

    it('does not display tip when zero', () => {
      render(<CartSummary items={mockCartItems} tip={0} />);
      expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    });

    it('displays discount when provided', () => {
      render(<CartSummary items={mockCartItems} discount={10.0} />);
      expect(screen.getByTestId('discount')).toHaveTextContent('-$10.00');
    });

    it('calculates total correctly with all values', () => {
      const simpleItem: CartItem[] = [
        {
          id: 'c1',
          menuItem: { ...mockMenuItems[0], price: 100 },
          quantity: 1,
          selectedModifiers: [],
          specialInstructions: '',
        },
      ];
      // Subtotal: 100, Tax: 8, Tip: 15, Discount: 10
      // Total: 100 + 8 + 15 - 10 = 113
      render(<CartSummary items={simpleItem} tip={15} discount={10} />);
      expect(screen.getByTestId('total')).toHaveTextContent('$113.00');
    });
  });

  describe('Checkout Button', () => {
    it('renders checkout button when onCheckout provided', () => {
      const onCheckout = vi.fn();
      render(<CartSummary items={mockCartItems} onCheckout={onCheckout} />);
      expect(screen.getByTestId('checkout-button')).toBeInTheDocument();
    });

    it('does not render checkout button when onCheckout not provided', () => {
      render(<CartSummary items={mockCartItems} />);
      expect(screen.queryByTestId('checkout-button')).not.toBeInTheDocument();
    });

    it('calls onCheckout when button clicked', async () => {
      const onCheckout = vi.fn();
      const { user } = render(
        <CartSummary items={mockCartItems} onCheckout={onCheckout} />
      );
      await user.click(screen.getByTestId('checkout-button'));
      expect(onCheckout).toHaveBeenCalledTimes(1);
    });

    it('disables button when loading', () => {
      const onCheckout = vi.fn();
      render(
        <CartSummary items={mockCartItems} onCheckout={onCheckout} isLoading />
      );
      expect(screen.getByTestId('checkout-button')).toBeDisabled();
    });

    it('shows loading text when loading', () => {
      const onCheckout = vi.fn();
      render(
        <CartSummary items={mockCartItems} onCheckout={onCheckout} isLoading />
      );
      expect(screen.getByTestId('checkout-button')).toHaveTextContent(
        'Processing...'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<CartSummary items={mockCartItems} />);
      expect(
        screen.getByRole('heading', { name: 'Order Summary' })
      ).toBeInTheDocument();
    });

    it('checkout button has accessible text', () => {
      const onCheckout = vi.fn();
      render(<CartSummary items={mockCartItems} onCheckout={onCheckout} />);
      expect(
        screen.getByRole('button', { name: 'Proceed to Checkout' })
      ).toBeInTheDocument();
    });
  });
});
