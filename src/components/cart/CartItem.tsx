'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const formatPrice = (price: number) => price.toFixed(2)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={clsx(
        'flex gap-4 p-4',
        'bg-white dark:bg-gray-800',
        'rounded-card shadow-card'
      )}
    >
      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {item.menuItem.name}
        </h3>

        {/* Modifiers */}
        {item.modifiers.length > 0 && (
          <div className="mt-1 text-small text-gray-500 dark:text-gray-400">
            {item.modifiers.map((mod) => mod.name).join(', ')}
          </div>
        )}

        {/* Special Instructions */}
        {item.specialInstructions && (
          <p className="mt-1 text-small text-gray-400 italic truncate">
            "{item.specialInstructions}"
          </p>
        )}

        {/* Price */}
        <div className="mt-2 price">
          ${formatPrice(item.totalPrice)}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className={clsx(
            'p-1.5 rounded-full',
            'text-gray-400 hover:text-red-500',
            'hover:bg-red-50 dark:hover:bg-red-900/20',
            'transition-colors duration-200'
          )}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className={clsx(
              'w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'bg-gray-100 dark:bg-gray-700',
              'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              'transition-colors duration-200'
            )}
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="w-4 h-4" />
          </motion.button>

          <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
            {item.quantity}
          </span>

          <motion.button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className={clsx(
              'w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'bg-primary-500 text-white',
              'hover:bg-primary-600',
              'transition-colors duration-200'
            )}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
