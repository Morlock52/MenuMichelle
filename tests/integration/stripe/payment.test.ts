import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  validateCardNumber,
  validateExpirationDate,
  validateCVV,
  detectCardType,
  formatCardNumber,
  calculateProcessingFee,
  PaymentError,
} from '../../../src/services/payment';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

describe('Payment Service', () => {
  describe('Card Validation', () => {
    describe('validateCardNumber', () => {
      it('validates correct Visa card', () => {
        expect(validateCardNumber('4111111111111111')).toBe(true);
      });

      it('validates correct Mastercard', () => {
        expect(validateCardNumber('5500000000000004')).toBe(true);
      });

      it('validates correct Amex card', () => {
        expect(validateCardNumber('378282246310005')).toBe(true);
      });

      it('rejects invalid card number', () => {
        expect(validateCardNumber('1234567890123456')).toBe(false);
      });

      it('rejects too short card number', () => {
        expect(validateCardNumber('123456789012')).toBe(false);
      });

      it('rejects too long card number', () => {
        expect(validateCardNumber('12345678901234567890')).toBe(false);
      });

      it('handles card numbers with spaces', () => {
        expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
      });

      it('handles card numbers with dashes', () => {
        expect(validateCardNumber('4111-1111-1111-1111')).toBe(true);
      });
    });

    describe('validateExpirationDate', () => {
      it('accepts future expiration date', () => {
        const futureYear = new Date().getFullYear() + 2;
        expect(validateExpirationDate(12, futureYear)).toBe(true);
      });

      it('accepts current month and year', () => {
        const now = new Date();
        expect(
          validateExpirationDate(now.getMonth() + 1, now.getFullYear())
        ).toBe(true);
      });

      it('rejects past expiration date', () => {
        expect(validateExpirationDate(1, 2020)).toBe(false);
      });

      it('rejects invalid month', () => {
        const futureYear = new Date().getFullYear() + 1;
        expect(validateExpirationDate(13, futureYear)).toBe(false);
        expect(validateExpirationDate(0, futureYear)).toBe(false);
      });

      it('handles 2-digit year format', () => {
        expect(validateExpirationDate(12, 30)).toBe(true); // 2030
      });
    });

    describe('validateCVV', () => {
      it('validates 3-digit CVV for standard cards', () => {
        expect(validateCVV('123', 'other')).toBe(true);
      });

      it('validates 4-digit CVV for Amex', () => {
        expect(validateCVV('1234', 'amex')).toBe(true);
      });

      it('rejects 4-digit CVV for standard cards', () => {
        expect(validateCVV('1234', 'other')).toBe(false);
      });

      it('rejects 3-digit CVV for Amex', () => {
        expect(validateCVV('123', 'amex')).toBe(false);
      });

      it('strips non-digit characters', () => {
        expect(validateCVV('12a', 'other')).toBe(false);
      });
    });
  });

  describe('Card Type Detection', () => {
    describe('detectCardType', () => {
      it('detects Visa cards', () => {
        expect(detectCardType('4111111111111111')).toBe('visa');
        expect(detectCardType('4012888888881881')).toBe('visa');
      });

      it('detects Mastercard', () => {
        expect(detectCardType('5500000000000004')).toBe('mastercard');
        expect(detectCardType('5105105105105100')).toBe('mastercard');
      });

      it('detects Amex', () => {
        expect(detectCardType('378282246310005')).toBe('amex');
        expect(detectCardType('371449635398431')).toBe('amex');
      });

      it('detects Discover', () => {
        expect(detectCardType('6011111111111117')).toBe('discover');
        expect(detectCardType('6500000000000002')).toBe('discover');
      });

      it('returns unknown for unrecognized cards', () => {
        expect(detectCardType('1234567890123456')).toBe('unknown');
      });
    });
  });

  describe('Card Formatting', () => {
    describe('formatCardNumber', () => {
      it('formats standard card numbers with spaces', () => {
        expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
      });

      it('formats Amex with 4-6-5 pattern', () => {
        expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
      });

      it('handles partial card numbers', () => {
        expect(formatCardNumber('4111')).toBe('4111');
        expect(formatCardNumber('41111111')).toBe('4111 1111');
      });

      it('strips non-digit characters first', () => {
        expect(formatCardNumber('4111-1111-1111-1111')).toBe(
          '4111 1111 1111 1111'
        );
      });
    });
  });

  describe('Processing Fee Calculation', () => {
    describe('calculateProcessingFee', () => {
      it('calculates fee with default rates (2.9% + $0.30)', () => {
        // $100 * 0.029 + 0.30 = $3.20
        expect(calculateProcessingFee(100)).toBe(3.2);
      });

      it('calculates fee with custom rates', () => {
        // $100 * 0.025 + 0.25 = $2.75
        expect(calculateProcessingFee(100, 0.025, 0.25)).toBe(2.75);
      });

      it('rounds to 2 decimal places', () => {
        // $33.33 * 0.029 + 0.30 = 1.26657 -> 1.27
        expect(calculateProcessingFee(33.33)).toBe(1.27);
      });

      it('handles zero amount', () => {
        expect(calculateProcessingFee(0)).toBe(0.3);
      });
    });
  });

  describe('Payment API', () => {
    beforeEach(() => {
      // Setup payment endpoint mocks
      server.use(
        http.post('/api/payments/intent', async ({ request }) => {
          const body = (await request.json()) as { orderId: string; amount: number };
          return HttpResponse.json({
            id: 'pi_test_123',
            clientSecret: 'pi_test_123_secret_abc',
            amount: body.amount,
            currency: 'usd',
            status: 'requires_payment_method',
          });
        }),

        http.post('/api/payments/confirm', async () => {
          return HttpResponse.json({
            success: true,
            orderId: 'order-123',
          });
        }),

        http.post('/api/payments/refund', async () => {
          return HttpResponse.json({
            success: true,
            refundId: 're_test_123',
          });
        })
      );
    });

    describe('createPaymentIntent', () => {
      it('creates payment intent successfully', async () => {
        const result = await createPaymentIntent({
          orderId: 'order-123',
          amount: 50.0,
        });

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('clientSecret');
        expect(result.amount).toBe(5000); // Amount in cents
      });

      it('converts amount to cents', async () => {
        const result = await createPaymentIntent({
          orderId: 'order-123',
          amount: 99.99,
        });

        expect(result.amount).toBe(9999);
      });

      it('handles payment intent creation failure', async () => {
        server.use(
          http.post('/api/payments/intent', () => {
            return HttpResponse.json(
              { message: 'Card declined' },
              { status: 400 }
            );
          })
        );

        await expect(
          createPaymentIntent({ orderId: 'order-123', amount: 50 })
        ).rejects.toThrow(PaymentError);
      });
    });

    describe('confirmPayment', () => {
      it('confirms payment successfully', async () => {
        const result = await confirmPayment({
          paymentIntentId: 'pi_test_123',
          paymentMethodId: 'pm_test_456',
        });

        expect(result.success).toBe(true);
        expect(result.orderId).toBe('order-123');
      });

      it('handles payment confirmation failure', async () => {
        server.use(
          http.post('/api/payments/confirm', () => {
            return HttpResponse.json(
              { message: 'Insufficient funds' },
              { status: 400 }
            );
          })
        );

        await expect(
          confirmPayment({
            paymentIntentId: 'pi_test_123',
            paymentMethodId: 'pm_test_456',
          })
        ).rejects.toThrow(PaymentError);
      });
    });

    describe('processRefund', () => {
      it('processes full refund successfully', async () => {
        const result = await processRefund('order-123');

        expect(result.success).toBe(true);
        expect(result.refundId).toBe('re_test_123');
      });

      it('processes partial refund', async () => {
        const result = await processRefund('order-123', 25.0);

        expect(result.success).toBe(true);
      });

      it('handles refund failure', async () => {
        server.use(
          http.post('/api/payments/refund', () => {
            return HttpResponse.json(
              { message: 'Refund not allowed' },
              { status: 400 }
            );
          })
        );

        await expect(processRefund('order-123')).rejects.toThrow(PaymentError);
      });
    });
  });

  describe('PaymentError', () => {
    it('contains error code', () => {
      const error = new PaymentError('Test error', 'test_code');
      expect(error.code).toBe('test_code');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PaymentError');
    });
  });
});
