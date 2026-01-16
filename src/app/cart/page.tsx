'use client'

import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, clearCart } = useCartStore()

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    alert('Checkout functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-48">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={clsx(
                'p-2 -ml-2 rounded-full',
                'text-gray-600 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-h2 font-bold text-gray-900 dark:text-white">
              Your Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-caption text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Cart Content */}
      <div className="px-4 py-6">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <motion.div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cart Summary */}
      <CartSummary onCheckout={handleCheckout} />
    </div>
  )
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className={clsx(
        'w-20 h-20 rounded-full',
        'bg-gray-100 dark:bg-gray-800',
        'flex items-center justify-center',
        'mb-4'
      )}>
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>

      <h2 className="text-h3 font-semibold text-gray-900 dark:text-white">
        Your cart is empty
      </h2>
      <p className="mt-2 text-body text-gray-500 dark:text-gray-400">
        Add some delicious items to get started
      </p>

      <Link href="/" className="mt-6">
        <Button>Browse Menu</Button>
      </Link>
    </motion.div>
  )
}
