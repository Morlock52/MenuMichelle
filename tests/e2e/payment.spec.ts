import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate with a table ID
    await page.goto('/?table=5');

    // Add an item to cart
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart and proceed to checkout
    await page.getByTestId('cart-button').click();
    await page.getByTestId('checkout-button').click();
  });

  test('displays payment form', async ({ page }) => {
    await expect(page.getByTestId('payment-form')).toBeVisible();
    await expect(page.getByTestId('card-input')).toBeVisible();
  });

  test('validates card number in real-time', async ({ page }) => {
    // Enter invalid card number
    await page.getByTestId('card-number-input').fill('1234567890123456');
    await page.getByTestId('card-number-input').blur();

    // Verify error is shown
    await expect(page.getByTestId('card-error')).toBeVisible();
    await expect(page.getByTestId('card-error')).toHaveText(/invalid card/i);
  });

  test('accepts valid test card number', async ({ page }) => {
    // Enter valid test card number
    await page.getByTestId('card-number-input').fill('4111111111111111');
    await page.getByTestId('card-number-input').blur();

    // Verify no error
    await expect(page.getByTestId('card-error')).not.toBeVisible();
  });

  test('formats card number as user types', async ({ page }) => {
    await page.getByTestId('card-number-input').fill('4111111111111111');

    // Verify formatted value
    await expect(page.getByTestId('card-number-input')).toHaveValue(
      '4111 1111 1111 1111'
    );
  });

  test('shows card type icon based on number', async ({ page }) => {
    // Enter Visa number
    await page.getByTestId('card-number-input').fill('4111');
    await expect(page.getByTestId('card-type-icon')).toHaveAttribute(
      'data-type',
      'visa'
    );

    // Clear and enter Amex number
    await page.getByTestId('card-number-input').clear();
    await page.getByTestId('card-number-input').fill('3782');
    await expect(page.getByTestId('card-type-icon')).toHaveAttribute(
      'data-type',
      'amex'
    );
  });

  test('validates expiration date', async ({ page }) => {
    // Enter expired date
    await page.getByTestId('expiry-input').fill('01/20');
    await page.getByTestId('expiry-input').blur();

    // Verify error
    await expect(page.getByTestId('expiry-error')).toBeVisible();
  });

  test('validates CVV length', async ({ page }) => {
    // Enter too short CVV
    await page.getByTestId('cvv-input').fill('12');
    await page.getByTestId('cvv-input').blur();

    // Verify error
    await expect(page.getByTestId('cvv-error')).toBeVisible();
  });

  test('allows tip selection', async ({ page }) => {
    // Select 20% tip
    await page.getByTestId('tip-option-20').click();

    // Verify tip is applied to total
    const tipAmount = await page.getByTestId('tip-amount').textContent();
    expect(tipAmount).not.toBe('$0.00');
  });

  test('allows custom tip entry', async ({ page }) => {
    // Click custom tip
    await page.getByTestId('tip-option-custom').click();

    // Enter custom amount
    await page.getByTestId('custom-tip-input').fill('7.50');

    // Verify tip is applied
    await expect(page.getByTestId('tip-amount')).toHaveText('$7.50');
  });

  test('submits payment successfully with Stripe test card', async ({ page }) => {
    // Fill in card details with Stripe test card
    await page.getByTestId('card-number-input').fill('4242424242424242');
    await page.getByTestId('expiry-input').fill('12/30');
    await page.getByTestId('cvv-input').fill('123');

    // Submit payment
    await page.getByTestId('pay-button').click();

    // Wait for success
    await expect(page.getByTestId('payment-success')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
  });

  test('shows error for declined card', async ({ page }) => {
    // Fill in card details with decline test card
    await page.getByTestId('card-number-input').fill('4000000000000002');
    await page.getByTestId('expiry-input').fill('12/30');
    await page.getByTestId('cvv-input').fill('123');

    // Submit payment
    await page.getByTestId('pay-button').click();

    // Verify error is shown
    await expect(page.getByTestId('payment-error')).toBeVisible();
    await expect(page.getByTestId('payment-error')).toHaveText(/declined/i);
  });

  test('disables pay button during processing', async ({ page }) => {
    // Fill in card details
    await page.getByTestId('card-number-input').fill('4242424242424242');
    await page.getByTestId('expiry-input').fill('12/30');
    await page.getByTestId('cvv-input').fill('123');

    // Click pay button
    await page.getByTestId('pay-button').click();

    // Verify button is disabled during processing
    await expect(page.getByTestId('pay-button')).toBeDisabled();
  });

  test('shows order tracking after successful payment', async ({ page }) => {
    // Complete payment
    await page.getByTestId('card-number-input').fill('4242424242424242');
    await page.getByTestId('expiry-input').fill('12/30');
    await page.getByTestId('cvv-input').fill('123');
    await page.getByTestId('pay-button').click();

    // Wait for success
    await expect(page.getByTestId('payment-success')).toBeVisible({
      timeout: 10000,
    });

    // Click track order
    await page.getByTestId('track-order-button').click();

    // Verify order tracking page
    await expect(page.getByTestId('order-status')).toBeVisible();
  });
});

test.describe('Payment Security', () => {
  test('does not expose card details in network requests', async ({ page }) => {
    await page.goto('/?table=5');

    // Add item and go to checkout
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();
    await page.getByTestId('cart-button').click();
    await page.getByTestId('checkout-button').click();

    // Monitor network requests
    const requests: string[] = [];
    page.on('request', (request) => {
      requests.push(request.postData() || '');
    });

    // Fill in card details and submit
    await page.getByTestId('card-number-input').fill('4242424242424242');
    await page.getByTestId('expiry-input').fill('12/30');
    await page.getByTestId('cvv-input').fill('123');
    await page.getByTestId('pay-button').click();

    // Verify full card number is not in any request
    for (const data of requests) {
      expect(data).not.toContain('4242424242424242');
    }
  });
});
