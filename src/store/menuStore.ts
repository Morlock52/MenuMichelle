import { create } from 'zustand'
import type { Category, MenuItem } from '@/types'

// Sample data for demonstration
const sampleCategories: Category[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal right',
    order: 1,
    items: [
      {
        id: 'app-1',
        name: 'Crispy Calamari',
        description: 'Tender calamari rings, lightly breaded and fried to perfection. Served with marinara sauce.',
        price: 14,
        categoryId: 'appetizers',
        dietary: { glutenFree: false },
        popular: true,
        available: true,
      },
      {
        id: 'app-2',
        name: 'Garden Bruschetta',
        description: 'Grilled ciabatta topped with fresh tomatoes, basil, garlic, and balsamic glaze.',
        price: 11,
        categoryId: 'appetizers',
        dietary: { vegetarian: true, vegan: true },
        available: true,
      },
      {
        id: 'app-3',
        name: 'Spinach Artichoke Dip',
        description: 'Creamy blend of spinach, artichokes, and cheeses. Served with warm tortilla chips.',
        price: 13,
        categoryId: 'appetizers',
        dietary: { vegetarian: true, glutenFree: true },
        available: true,
      },
    ],
  },
  {
    id: 'mains',
    name: 'Main Courses',
    description: 'Signature dishes',
    order: 2,
    items: [
      {
        id: 'main-1',
        name: 'Grilled Atlantic Salmon',
        description: 'Fresh salmon fillet with lemon herb butter, roasted vegetables, and wild rice pilaf.',
        price: 28,
        categoryId: 'mains',
        dietary: { glutenFree: true, dairyFree: false },
        popular: true,
        available: true,
      },
      {
        id: 'main-2',
        name: 'Filet Mignon',
        description: '8oz center-cut tenderloin, garlic mashed potatoes, grilled asparagus, red wine reduction.',
        price: 42,
        categoryId: 'mains',
        dietary: { glutenFree: true },
        available: true,
      },
      {
        id: 'main-3',
        name: 'Mushroom Risotto',
        description: 'Creamy arborio rice with wild mushrooms, parmesan, truffle oil, and fresh herbs.',
        price: 22,
        categoryId: 'mains',
        dietary: { vegetarian: true, glutenFree: true },
        available: true,
      },
      {
        id: 'main-4',
        name: 'Thai Green Curry',
        description: 'Coconut curry with seasonal vegetables, jasmine rice. Choice of tofu or chicken.',
        price: 19,
        categoryId: 'mains',
        dietary: { glutenFree: true, dairyFree: true, spicy: 2 },
        available: true,
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings',
    order: 3,
    items: [
      {
        id: 'dessert-1',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, vanilla ice cream, and raspberry coulis.',
        price: 12,
        categoryId: 'desserts',
        dietary: { vegetarian: true },
        popular: true,
        available: true,
      },
      {
        id: 'dessert-2',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
        price: 10,
        categoryId: 'desserts',
        dietary: { vegetarian: true },
        available: true,
      },
      {
        id: 'dessert-3',
        name: 'Fresh Fruit Sorbet',
        description: 'Seasonal fruit sorbet trio. Dairy-free and refreshing.',
        price: 8,
        categoryId: 'desserts',
        dietary: { vegan: true, glutenFree: true, dairyFree: true },
        available: true,
      },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Drinks & refreshments',
    order: 4,
    items: [
      {
        id: 'bev-1',
        name: 'Fresh Squeezed Lemonade',
        description: 'House-made with fresh lemons, a hint of mint, and pure cane sugar.',
        price: 5,
        categoryId: 'beverages',
        dietary: { vegan: true, glutenFree: true },
        available: true,
      },
      {
        id: 'bev-2',
        name: 'Craft Iced Tea',
        description: 'Cold-brewed black tea with peach and hibiscus. Unsweetened or lightly sweetened.',
        price: 4,
        categoryId: 'beverages',
        dietary: { vegan: true, glutenFree: true },
        available: true,
      },
      {
        id: 'bev-3',
        name: 'Espresso',
        description: 'Double shot of our signature dark roast. Rich and bold.',
        price: 4,
        categoryId: 'beverages',
        dietary: { vegan: true, glutenFree: true },
        available: true,
      },
    ],
  },
]

interface MenuState {
  categories: Category[]
  selectedCategory: string | null
  searchQuery: string
  setCategories: (categories: Category[]) => void
  setSelectedCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  getFilteredItems: () => MenuItem[]
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: sampleCategories,
  selectedCategory: null,
  searchQuery: '',

  setCategories: (categories) => set({ categories }),

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredItems: () => {
    const { categories, searchQuery, selectedCategory } = get()
    let items: MenuItem[] = []

    const filteredCategories = selectedCategory
      ? categories.filter(cat => cat.id === selectedCategory)
      : categories

    filteredCategories.forEach(cat => {
      items = [...items, ...cat.items]
    })

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      )
    }

    return items
  },
}))
