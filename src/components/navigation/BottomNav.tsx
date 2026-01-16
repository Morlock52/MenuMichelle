'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Home, BookOpen, ShoppingCart, ClipboardList, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/menu', icon: BookOpen, label: 'Menu' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', showBadge: true },
  { href: '/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <nav
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/90 dark:bg-gray-900/90',
        'backdrop-blur-lg',
        'border-t border-gray-200 dark:border-gray-800',
        'safe-bottom'
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'relative flex flex-col items-center justify-center',
                'w-16 h-14 rounded-xl',
                'transition-colors duration-200',
                isActive
                  ? 'text-primary-500'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />

                {/* Cart Badge */}
                {item.showBadge && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={clsx(
                      'absolute -top-1.5 -right-1.5',
                      'min-w-[18px] h-[18px] px-1',
                      'flex items-center justify-center',
                      'bg-primary-500 text-white',
                      'text-[10px] font-bold',
                      'rounded-full'
                    )}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </div>

              <span className="mt-1 text-[10px] font-medium">{item.label}</span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
