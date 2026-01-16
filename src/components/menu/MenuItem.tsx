'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DietaryIcons } from '@/components/ui/DietaryIcon'
import { useCartStore } from '@/store/cartStore'
import type { MenuItem as MenuItemType } from '@/types'

interface MenuItemProps {
  item: MenuItemType
  onSelect?: (item: MenuItemType) => void
}

export function MenuItem({ item, onSelect }: MenuItemProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(item, 1)
  }

  // Format price without dollar sign (design improvement #4)
  const formatPrice = (price: number) => {
    return price.toFixed(0)
  }

  return (
    <Card
      hoverable
      padding="none"
      className="overflow-hidden"
      onClick={() => onSelect?.(item)}
    >
      <div className="flex">
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-body font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                {item.popular && (
                  <Badge variant="primary">Popular</Badge>
                )}
              </div>

              <p className="mt-1 text-caption text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="price text-h3">{formatPrice(item.price)}</span>
                  <DietaryIcons dietary={item.dietary} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image or Add Button */}
        <div className="relative flex-shrink-0 w-24 sm:w-28">
          {item.image ? (
            <div className="relative h-full">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <motion.button
                onClick={handleAddToCart}
                className={clsx(
                  'absolute bottom-2 right-2',
                  'w-8 h-8 rounded-full',
                  'bg-primary-500 text-white',
                  'flex items-center justify-center',
                  'shadow-lg',
                  'hover:bg-primary-600',
                  'transition-colors duration-200'
                )}
                whileTap={{ scale: 0.9 }}
                disabled={!item.available}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
              <motion.button
                onClick={handleAddToCart}
                className={clsx(
                  'w-10 h-10 rounded-full',
                  'bg-primary-500 text-white',
                  'flex items-center justify-center',
                  'shadow-md',
                  'hover:bg-primary-600',
                  'transition-colors duration-200',
                  !item.available && 'opacity-50 cursor-not-allowed'
                )}
                whileTap={{ scale: 0.9 }}
                disabled={!item.available}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          {/* Unavailable overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="text-small text-white font-medium px-2 py-1 bg-gray-900/70 rounded">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
