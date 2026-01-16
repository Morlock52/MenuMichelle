import { http, HttpResponse } from 'msw';
import { mockMenuItems, mockCategories, mockOrder } from './data';

// API base URL
const API_URL = '/api';

// Define API handlers for mocking
export const handlers = [
  // Menu endpoints
  http.get(`${API_URL}/menu`, () => {
    return HttpResponse.json(mockMenuItems);
  }),

  http.get(`${API_URL}/menu/:id`, ({ params }) => {
    const item = mockMenuItems.find((i) => i.id === params.id);
    if (!item) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(item);
  }),

  // Categories endpoint
  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),

  // Orders endpoints
  http.post(`${API_URL}/orders`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        ...mockOrder,
        items: (body as { items?: unknown[] }).items || [],
      },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/orders/:id`, ({ params }) => {
    return HttpResponse.json({
      ...mockOrder,
      id: params.id,
    });
  }),

  http.patch(`${API_URL}/orders/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...mockOrder,
      id: params.id,
      ...(body as object),
    });
  }),

  // Table session endpoint
  http.get(`${API_URL}/tables/:tableId/session`, ({ params }) => {
    return HttpResponse.json({
      tableId: params.tableId,
      sessionId: 'session-123',
      createdAt: new Date().toISOString(),
    });
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = {
  networkError: http.get(`${API_URL}/menu`, () => {
    return HttpResponse.error();
  }),

  serverError: http.get(`${API_URL}/menu`, () => {
    return new HttpResponse(null, { status: 500 });
  }),

  orderCreationError: http.post(`${API_URL}/orders`, () => {
    return HttpResponse.json(
      { error: 'Failed to create order' },
      { status: 400 }
    );
  }),
};
