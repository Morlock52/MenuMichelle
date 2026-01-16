/**
 * API Service Layer
 * Centralized API calls with error handling and type safety
 */

import type { ApiResponse, Category, MenuItem, Order, OrderType } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data: ApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || 'An unknown error occurred',
      response.status
    )
  }

  return data.data as T
}

// Menu API
export const menuApi = {
  getCategories: () => request<Category[]>('/menu/categories'),

  getMenuItems: (categoryId?: string) => {
    const query = categoryId ? `?category=${categoryId}` : ''
    return request<MenuItem[]>(`/menu${query}`)
  },

  getMenuItem: (id: string) => request<MenuItem>(`/menu/${id}`),

  searchItems: (query: string) =>
    request<MenuItem[]>(`/menu/search?q=${encodeURIComponent(query)}`),
}

// Orders API
export const ordersApi = {
  createOrder: (data: {
    items: Array<{ menuItemId: string; quantity: number; modifiers?: string[] }>
    tableId?: string
    orderType: OrderType
    specialInstructions?: string
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  getOrderHistory: () => request<Order[]>('/orders/history'),

  cancelOrder: (id: string) =>
    request<Order>(`/orders/${id}/cancel`, { method: 'POST' }),
}

// Table Session API
export const tableApi = {
  startSession: (tableId: string) =>
    request<{ sessionId: string; tableNumber: string }>(`/tables/${tableId}/session`, {
      method: 'POST',
    }),

  getSession: (tableId: string) =>
    request<{ sessionId: string; tableNumber: string; orders: Order[] }>(
      `/tables/${tableId}/session`
    ),

  endSession: (tableId: string) =>
    request<void>(`/tables/${tableId}/session`, { method: 'DELETE' }),
}

export { ApiError }
