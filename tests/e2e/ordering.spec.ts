import { test, expect } from '@playwright/test';

test.describe('Ordering Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the menu page
    await page.goto('/');
  });

  test('displays menu items on homepage', async ({ page }) => {
    // Wait for menu items to load
    await expect(page.getByTestId('menu-list')).toBeVisible();

    // Check that menu items are displayed
    const menuItems = page.getByTestId('menu-item');
    await expect(menuItems.first()).toBeVisible();
  });

  test('can add item to cart', async ({ page }) => {
    // Click on a menu item
    await page.getByTestId('menu-item').first().click();

    // Click add to cart button
    await page.getByTestId('add-to-cart-button').click();

    // Verify cart badge shows 1 item
    await expect(page.getByTestId('cart-badge')).toHaveText('1');
  });

  test('can view cart and see items', async ({ page }) => {
    // Add an item first
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart
    await page.getByTestId('cart-button').click();

    // Verify cart modal is visible with item
    await expect(page.getByTestId('cart-modal')).toBeVisible();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
  });

  test('can update item quantity in cart', async ({ page }) => {
    // Add an item
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart
    await page.getByTestId('cart-button').click();

    // Increase quantity
    await page.getByTestId('increase-quantity').click();

    // Verify quantity updated
    await expect(page.getByTestId('item-quantity')).toHaveText('2');
  });

  test('can remove item from cart', async ({ page }) => {
    // Add an item
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart
    await page.getByTestId('cart-button').click();

    // Remove item
    await page.getByTestId('remove-item').click();

    // Verify cart is empty
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();
  });

  test('can proceed to checkout', async ({ page }) => {
    // Add an item
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart
    await page.getByTestId('cart-button').click();

    // Click checkout
    await page.getByTestId('checkout-button').click();

    // Verify checkout page is shown
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });

  test('displays order total correctly', async ({ page }) => {
    // Add an item
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart
    await page.getByTestId('cart-button').click();

    // Verify totals are displayed
    await expect(page.getByTestId('subtotal')).toBeVisible();
    await expect(page.getByTestId('tax')).toBeVisible();
    await expect(page.getByTestId('total')).toBeVisible();
  });
});

test.describe('Menu Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can filter by category', async ({ page }) => {
    // Click on a category filter
    await page.getByTestId('category-filter').getByText('Burgers').click();

    // Verify only burger items are shown
    const menuItems = page.getByTestId('menu-item');
    await expect(menuItems).toHaveCount(2); // 2 burger items in mock data
  });

  test('can search for items', async ({ page }) => {
    // Type in search box
    await page.getByTestId('search-input').fill('Pizza');

    // Verify filtered results
    await expect(page.getByText('Margherita Pizza')).toBeVisible();
    await expect(page.getByText('Classic Burger')).not.toBeVisible();
  });

  test('shows allergen warnings', async ({ page }) => {
    // Enable allergen filter
    await page.getByTestId('allergen-filter').click();
    await page.getByLabel('Gluten').check();

    // Verify allergen warning is displayed
    await expect(page.getByTestId('allergen-warning')).toBeVisible();
  });
});

test.describe('QR Code Scanning', () => {
  test('loads table session from QR code URL', async ({ page }) => {
    // Navigate with table ID in URL (simulating QR code scan)
    await page.goto('/?table=5');

    // Verify table session is established
    await expect(page.getByTestId('table-indicator')).toHaveText('Table 5');
  });

  test('maintains table session across navigation', async ({ page }) => {
    await page.goto('/?table=5');

    // Navigate to another page
    await page.getByTestId('menu-item').first().click();

    // Verify table indicator is still visible
    await expect(page.getByTestId('table-indicator')).toHaveText('Table 5');
  });
});

test.describe('Accessibility', () => {
  test('menu items are keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab to first menu item
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is on menu item
    await expect(page.getByTestId('menu-item').first()).toBeFocused();
  });

  test('cart modal can be closed with Escape', async ({ page }) => {
    await page.goto('/');

    // Add item and open cart
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();
    await page.getByTestId('cart-button').click();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify cart modal is closed
    await expect(page.getByTestId('cart-modal')).not.toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows mobile navigation', async ({ page }) => {
    await page.goto('/');

    // Verify mobile menu button is visible
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
  });

  test('cart is accessible on mobile', async ({ page }) => {
    await page.goto('/');

    // Add item
    await page.getByTestId('menu-item').first().click();
    await page.getByTestId('add-to-cart-button').click();

    // Open cart (might be in a drawer on mobile)
    await page.getByTestId('cart-button').click();

    // Verify cart is visible
    await expect(page.getByTestId('cart-modal')).toBeVisible();
  });
});
