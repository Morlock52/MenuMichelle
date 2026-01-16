import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem, SelectedModifier } from '@/types'

interface CartState {
  items: CartItem[]
  tableId: string | null

  // Actions
  addItem: (menuItem: MenuItem, quantity: number, modifiers?: SelectedModifier[], instructions?: string) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  setTableId: (tableId: string | null) => void

  // Computed
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
  getItemCount: () => number
}

const TAX_RATE = 0.0875 // 8.75% tax

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,

      addItem: (menuItem, quantity, modifiers = [], instructions) => {
        const modifierTotal = modifiers.reduce((sum, mod) => sum + mod.price, 0)
        const itemTotal = (menuItem.price + modifierTotal) * quantity

        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          modifiers,
          specialInstructions: instructions,
          totalPrice: itemTotal,
        }

        set((state) => ({
          items: [...state.items, newItem],
        }))
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }))
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price, 0)
              return {
                ...item,
                quantity,
                totalPrice: (item.menuItem.price + modifierTotal) * quantity,
              }
            }
            return item
          }),
        }))
      },

      clearCart: () => set({ items: [] }),

      setTableId: (tableId) => set({ tableId }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0)
      },

      getTax: () => {
        return get().getSubtotal() * TAX_RATE
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const tax = subtotal * TAX_RATE
        return subtotal + tax
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'menu-michelle-cart',
      partialize: (state) => ({
        items: state.items,
        tableId: state.tableId,
      }),
    }
  )
)
