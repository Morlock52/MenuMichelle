'use client'

import { useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { Category } from '@/types'

interface CategoryTabsProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Scroll selected tab into view
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current
      const selected = selectedRef.current
      const containerRect = container.getBoundingClientRect()
      const selectedRect = selected.getBoundingClientRect()

      const scrollLeft =
        selected.offsetLeft -
        container.offsetWidth / 2 +
        selected.offsetWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [selectedId])

  return (
    <div
      ref={scrollRef}
      className={clsx(
        'flex gap-2 px-4 py-3',
        'overflow-x-auto scrollbar-hide',
        'border-b border-gray-100 dark:border-gray-800',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
        'sticky top-0 z-10'
      )}
    >
      {/* All categories button */}
      <motion.button
        ref={selectedId === null ? selectedRef : undefined}
        onClick={() => onSelect(null)}
        className={clsx(
          'flex-shrink-0 px-4 py-2 rounded-full',
          'text-caption font-medium',
          'transition-all duration-200',
          selectedId === null
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        )}
        whileTap={{ scale: 0.95 }}
      >
        All
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category.id}
          ref={selectedId === category.id ? selectedRef : undefined}
          onClick={() => onSelect(category.id)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-full',
            'text-caption font-medium whitespace-nowrap',
            'transition-all duration-200',
            selectedId === category.id
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  )
}
