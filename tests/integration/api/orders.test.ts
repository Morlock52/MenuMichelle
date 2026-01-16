import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '../../mocks/server';
import { errorHandlers } from '../../mocks/handlers';
import {
  fetchMenuItems,
  fetchMenuItem,
  fetchCategories,
  createOrder,
  fetchOrder,
  updateOrder,
  fetchTableSession,
  ApiError,
} from '../../../src/services/api';
import { mockMenuItems, mockCategories, mockCartItems } from '../../mocks/data';

describe('API Integration Tests', () => {
  describe('Menu API', () => {
    describe('fetchMenuItems', () => {
      it('fetches all menu items successfully', async () => {
        const items = await fetchMenuItems();
        expect(items).toHaveLength(mockMenuItems.length);
        expect(items[0]).toHaveProperty('id');
        expect(items[0]).toHaveProperty('name');
        expect(items[0]).toHaveProperty('price');
      });

      it('handles network errors gracefully', async () => {
        server.use(errorHandlers.networkError);
        await expect(fetchMenuItems()).rejects.toThrow();
      });

      it('handles server errors with proper error message', async () => {
        server.use(errorHandlers.serverError);
        await expect(fetchMenuItems()).rejects.toThrow(ApiError);
      });
    });

    describe('fetchMenuItem', () => {
      it('fetches a single menu item by ID', async () => {
        const item = await fetchMenuItem('item-1');
        expect(item.id).toBe('item-1');
        expect(item.name).toBe('Classic Burger');
      });

      it('throws error for non-existent item', async () => {
        await expect(fetchMenuItem('non-existent')).rejects.toThrow(ApiError);
      });
    });

    describe('fetchCategories', () => {
      it('fetches all categories successfully', async () => {
        const categories = await fetchCategories();
        expect(categories).toHaveLength(mockCategories.length);
        expect(categories[0]).toHaveProperty('id');
        expect(categories[0]).toHaveProperty('name');
      });
    });
  });

  describe('Orders API', () => {
    describe('createOrder', () => {
      it('creates an order successfully', async () => {
        const payload = {
          tableId: 'table-5',
          items: mockCartItems,
          tip: 5.0,
        };
        const order = await createOrder(payload);
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('status', 'pending');
        expect(order.items).toBeDefined();
      });

      it('handles order creation errors', async () => {
        server.use(errorHandlers.orderCreationError);
        const payload = {
          tableId: 'table-5',
          items: mockCartItems,
        };
        await expect(createOrder(payload)).rejects.toThrow(ApiError);
      });
    });

    describe('fetchOrder', () => {
      it('fetches an order by ID', async () => {
        const order = await fetchOrder('order-123');
        expect(order.id).toBe('order-123');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('items');
      });
    });

    describe('updateOrder', () => {
      it('updates an order status', async () => {
        const updated = await updateOrder('order-123', { status: 'confirmed' });
        expect(updated.id).toBe('order-123');
        expect(updated.status).toBe('confirmed');
      });

      it('updates order tip', async () => {
        const updated = await updateOrder('order-123', { tip: 10.0 });
        expect(updated.tip).toBe(10.0);
      });
    });
  });

  describe('Table API', () => {
    describe('fetchTableSession', () => {
      it('fetches table session by table ID', async () => {
        const session = await fetchTableSession('table-5');
        expect(session.tableId).toBe('table-5');
        expect(session).toHaveProperty('sessionId');
        expect(session).toHaveProperty('createdAt');
      });
    });
  });

  describe('Error Handling', () => {
    it('ApiError contains status code', async () => {
      server.use(errorHandlers.serverError);
      try {
        await fetchMenuItems();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
      }
    });

    it('ApiError contains error message', async () => {
      server.use(errorHandlers.orderCreationError);
      try {
        await createOrder({ tableId: 'test', items: [] });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toContain('Failed to create order');
      }
    });
  });
});
