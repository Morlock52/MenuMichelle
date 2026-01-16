import type { PaymentIntent, PaymentResult } from '../types';

const API_BASE = '/api';

export interface CreatePaymentIntentPayload {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  paymentMethodId: string;
}

/**
 * Create a payment intent for an order
 */
export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload
): Promise<PaymentIntent> {
  const response = await fetch(`${API_BASE}/payments/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: payload.orderId,
      amount: Math.round(payload.amount * 100), // Convert to cents
      currency: payload.currency || 'usd',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PaymentError(
      error.message || 'Failed to create payment intent',
      'creation_failed'
    );
  }

  return response.json();
}

/**
 * Confirm a payment with the provided payment method
 */
export async function confirmPayment(
  payload: ConfirmPaymentPayload
): Promise<PaymentResult> {
  const response = await fetch(`${API_BASE}/payments/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PaymentError(
      error.message || 'Payment confirmation failed',
      'confirmation_failed'
    );
  }

  return response.json();
}

/**
 * Process a refund for an order
 */
export async function processRefund(
  orderId: string,
  amount?: number
): Promise<{ success: boolean; refundId: string }> {
  const response = await fetch(`${API_BASE}/payments/refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      amount: amount ? Math.round(amount * 100) : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PaymentError(error.message || 'Refund failed', 'refund_failed');
  }

  return response.json();
}

/**
 * Validate a card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate expiration date
 */
export function validateExpirationDate(month: number, year: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Convert 2-digit year to 4-digit
  const fullYear = year < 100 ? 2000 + year : year;

  if (fullYear < currentYear) {
    return false;
  }

  if (fullYear === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string, cardType: 'amex' | 'other' = 'other'): boolean {
  const digits = cvv.replace(/\D/g, '');
  const expectedLength = cardType === 'amex' ? 4 : 3;
  return digits.length === expectedLength;
}

/**
 * Detect card type from card number
 */
export function detectCardType(
  cardNumber: string
): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';

  return 'unknown';
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const cardType = detectCardType(digits);

  if (cardType === 'amex') {
    // Amex: 4-6-5 format
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
  }

  // Other cards: 4-4-4-4 format
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Calculate processing fee (typically 2.9% + $0.30 for Stripe)
 */
export function calculateProcessingFee(
  amount: number,
  rate: number = 0.029,
  flatFee: number = 0.3
): number {
  return Math.round((amount * rate + flatFee) * 100) / 100;
}

// Custom error class for payment errors
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}
