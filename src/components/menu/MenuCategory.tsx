'use client'

import { clsx } from 'clsx'
import { MenuItem } from './MenuItem'
import type { Category, MenuItem as MenuItemType } from '@/types'

interface MenuCategoryProps {
  category: Category
  onItemSelect?: (item: MenuItemType) => void
}

export function MenuCategory({ category, onItemSelect }: MenuCategoryProps) {
  return (
    <section className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 font-bold text-gray-900 dark:text-white">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-0.5 text-caption text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>
        <span className="text-caption text-gray-400">
          {category.items.length} items
        </span>
      </div>

      {/* Items Grid */}
      <div className="space-y-3">
        {category.items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onSelect={onItemSelect}
          />
        ))}
      </div>
    </section>
  )
}
