// Menu Types
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
  dietary: DietaryInfo
  modifiers?: ModifierGroup[]
  popular?: boolean
  available: boolean
}

export interface DietaryInfo {
  vegetarian?: boolean
  vegan?: boolean
  glutenFree?: boolean
  halal?: boolean
  dairyFree?: boolean
  nutFree?: boolean
  spicy?: 1 | 2 | 3
}

export interface ModifierGroup {
  id: string
  name: string
  required: boolean
  minSelect: number
  maxSelect: number
  options: ModifierOption[]
}

export interface ModifierOption {
  id: string
  name: string
  price: number
  default?: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  items: MenuItem[]
  order: number
}

// Cart Types
export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  modifiers: SelectedModifier[]
  specialInstructions?: string
  totalPrice: number
}

export interface SelectedModifier {
  groupId: string
  optionId: string
  name: string
  price: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  tableId?: string
}

// Order Types
export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  tableId?: string
  orderType: OrderType
  subtotal: number
  tax: number
  tip: number
  total: number
  createdAt: Date
  updatedAt: Date
  estimatedReadyTime?: Date
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export type OrderType = 'dine-in' | 'takeout' | 'delivery'

// Table Types
export interface Table {
  id: string
  number: string
  qrCode: string
  status: 'available' | 'occupied' | 'reserved'
  capacity: number
}

// API Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: PaginationMeta
}

export interface ApiError {
  code: string
  message: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Language Types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar'

export interface LocaleConfig {
  code: Language
  name: string
  nativeName: string
  rtl?: boolean
}
