import type { MenuItem, Category, Order, CartItem } from '../../src/types';

// Mock menu items for testing
export const mockMenuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    categoryId: 'cat-1',
    image: '/images/burger.jpg',
    available: true,
    allergens: ['gluten', 'dairy'],
    modifiers: [
      {
        id: 'mod-1',
        name: 'Add Cheese',
        price: 1.5,
        type: 'addon',
      },
      {
        id: 'mod-2',
        name: 'Add Bacon',
        price: 2.0,
        type: 'addon',
      },
    ],
  },
  {
    id: 'item-2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with caesar dressing and croutons',
    price: 9.99,
    categoryId: 'cat-2',
    image: '/images/salad.jpg',
    available: true,
    allergens: ['gluten', 'dairy', 'eggs'],
    modifiers: [
      {
        id: 'mod-3',
        name: 'Add Grilled Chicken',
        price: 4.0,
        type: 'addon',
      },
    ],
  },
  {
    id: 'item-3',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 14.99,
    categoryId: 'cat-3',
    image: '/images/pizza.jpg',
    available: true,
    allergens: ['gluten', 'dairy'],
    modifiers: [],
  },
  {
    id: 'item-4',
    name: 'Sold Out Item',
    description: 'This item is currently unavailable',
    price: 19.99,
    categoryId: 'cat-1',
    image: '/images/soldout.jpg',
    available: false,
    allergens: [],
    modifiers: [],
  },
];

// Mock categories for testing
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Burgers',
    description: 'Handcrafted burgers',
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Salads',
    description: 'Fresh and healthy salads',
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Pizza',
    description: 'Wood-fired pizzas',
    sortOrder: 3,
  },
];

// Mock cart items for testing
export const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    menuItem: mockMenuItems[0],
    quantity: 2,
    selectedModifiers: [mockMenuItems[0].modifiers[0]],
    specialInstructions: 'No onions please',
  },
  {
    id: 'cart-2',
    menuItem: mockMenuItems[1],
    quantity: 1,
    selectedModifiers: [],
    specialInstructions: '',
  },
];

// Mock order for testing
export const mockOrder: Order = {
  id: 'order-123',
  tableId: 'table-5',
  status: 'pending',
  items: mockCartItems,
  subtotal: 38.47,
  tax: 3.08,
  tip: 5.0,
  total: 46.55,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Order status progression for testing
export const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'completed',
] as const;
