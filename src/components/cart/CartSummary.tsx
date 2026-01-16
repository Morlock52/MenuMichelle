'use client'

import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

interface CartSummaryProps {
  onCheckout?: () => void
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { getSubtotal, getTax, getTotal, items } = useCartStore()

  const subtotal = getSubtotal()
  const tax = getTax()
  const total = getTotal()

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (items.length === 0) return null

  return (
    <div
      className={clsx(
        'fixed bottom-20 left-0 right-0 z-40',
        'bg-white dark:bg-gray-900',
        'border-t border-gray-200 dark:border-gray-800',
        'shadow-lg',
        'safe-bottom'
      )}
    >
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Summary Lines */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-caption text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-caption text-gray-600 dark:text-gray-400">
            <span>Tax (8.75%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-body font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span className="price">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          fullWidth
          size="lg"
          onClick={onCheckout}
        >
          Place Order - {formatPrice(total)}
        </Button>
      </div>
    </div>
  )
}
