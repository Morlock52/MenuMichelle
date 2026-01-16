// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  available: boolean;
  allergens: string[];
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  type: 'addon' | 'substitution' | 'size';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

// Cart Types
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Modifier[];
  specialInstructions: string;
}

export interface Cart {
  items: CartItem[];
  tableId: string | null;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  paymentIntentId?: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

// Table Types
export interface TableSession {
  tableId: string;
  sessionId: string;
  createdAt: string;
  expiresAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
