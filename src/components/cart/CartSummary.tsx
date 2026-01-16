import React from 'react';
import type { CartItem } from '../../types';
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatPrice,
} from '../../utils/price';

interface CartSummaryProps {
  items: CartItem[];
  tip?: number;
  discount?: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  items,
  tip = 0,
  discount = 0,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax, tip, discount);

  const isEmpty = items.length === 0;

  return (
    <div className="cart-summary" data-testid="cart-summary">
      <h2>Order Summary</h2>

      {isEmpty ? (
        <p data-testid="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item" data-testid="cart-item">
                <span className="item-name">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span className="item-price">
                  {formatPrice(
                    (item.menuItem.price +
                      item.selectedModifiers.reduce((sum, m) => sum + m.price, 0)) *
                      item.quantity
                  )}
                </span>
                {item.selectedModifiers.length > 0 && (
                  <div className="modifiers" data-testid="item-modifiers">
                    {item.selectedModifiers.map((mod) => (
                      <span key={mod.id} className="modifier">
                        + {mod.name} ({formatPrice(mod.price)})
                      </span>
                    ))}
                  </div>
                )}
                {item.specialInstructions && (
                  <div
                    className="special-instructions"
                    data-testid="special-instructions"
                  >
                    Note: {item.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="cart-totals" data-testid="cart-totals">
            <div className="line-item">
              <span>Subtotal</span>
              <span data-testid="subtotal">{formatPrice(subtotal)}</span>
            </div>
            <div className="line-item">
              <span>Tax</span>
              <span data-testid="tax">{formatPrice(tax)}</span>
            </div>
            {tip > 0 && (
              <div className="line-item">
                <span>Tip</span>
                <span data-testid="tip">{formatPrice(tip)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="line-item discount">
                <span>Discount</span>
                <span data-testid="discount">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="line-item total">
              <span>Total</span>
              <span data-testid="total">{formatPrice(total)}</span>
            </div>
          </div>

          {onCheckout && (
            <button
              onClick={onCheckout}
              disabled={isLoading || isEmpty}
              className="checkout-button"
              data-testid="checkout-button"
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
