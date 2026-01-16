import type {
  MenuItem,
  Category,
  Order,
  CartItem,
  TableSession,
  ApiResponse,
} from '../types';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.error || `HTTP error ${response.status}`,
      response.status,
      data
    );
  }
  return response.json();
}

// Menu API
export async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch(`${API_BASE}/menu`);
  return handleResponse<MenuItem[]>(response);
}

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`${API_BASE}/menu/${id}`);
  return handleResponse<MenuItem>(response);
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  return handleResponse<Category[]>(response);
}

// Orders API
export interface CreateOrderPayload {
  tableId: string;
  items: CartItem[];
  tip?: number;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Order>(response);
}

export async function fetchOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${id}`);
  return handleResponse<Order>(response);
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<Order>(response);
}

// Table API
export async function fetchTableSession(tableId: string): Promise<TableSession> {
  const response = await fetch(`${API_BASE}/tables/${tableId}/session`);
  return handleResponse<TableSession>(response);
}

export { ApiError };
