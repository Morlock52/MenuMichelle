'use client'

import { MenuCategory } from '@/components/menu/MenuCategory'
import { Header } from '@/components/layout/Header'
import { SearchBar } from '@/components/ui/SearchBar'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { useMenuStore } from '@/store/menuStore'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { categories, selectedCategory, setSelectedCategory } = useMenuStore()

  const filteredCategories = selectedCategory
    ? categories.filter(cat => cat.id === selectedCategory)
    : categories

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <div className="px-4 pt-4 pb-2">
        <SearchBar placeholder="Search menu items..." />
      </div>

      <CategoryTabs
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <motion.div
        className="px-4 py-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MenuCategory category={category} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
