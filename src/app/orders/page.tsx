'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { ClipboardList, Clock, CheckCircle2, ChefHat, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Sample order data
const sampleOrders = [
  {
    id: 'ORD-001',
    status: 'preparing',
    items: [
      { name: 'Grilled Atlantic Salmon', quantity: 1 },
      { name: 'Crispy Calamari', quantity: 1 },
    ],
    total: 42.0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 10 * 60 * 1000),
  },
  {
    id: 'ORD-002',
    status: 'completed',
    items: [
      { name: 'Mushroom Risotto', quantity: 2 },
      { name: 'Chocolate Lava Cake', quantity: 2 },
    ],
    total: 68.0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const statusConfig = {
  pending: { icon: Clock, color: 'warning', label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: 'primary', label: 'Confirmed' },
  preparing: { icon: ChefHat, color: 'primary', label: 'Preparing' },
  ready: { icon: Package, color: 'success', label: 'Ready' },
  completed: { icon: CheckCircle2, color: 'success', label: 'Completed' },
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="px-4 py-4">
          <h1 className="text-h1 font-bold text-gray-900 dark:text-white">
            Your Orders
          </h1>
          <p className="mt-1 text-caption text-gray-500 dark:text-gray-400">
            Track and view your order history
          </p>
        </div>
      </header>

      {/* Orders List */}
      <div className="px-4 py-6 space-y-4">
        {sampleOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          sampleOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function OrderCard({ order }: { order: typeof sampleOrders[0] }) {
  const status = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-small text-gray-500 dark:text-gray-400">
            {order.id}
          </p>
          <p className="text-caption text-gray-400 dark:text-gray-500">
            Ordered at {formatTime(order.createdAt)}
          </p>
        </div>
        <Badge variant={status.color as 'primary' | 'success' | 'warning'}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between text-body text-gray-700 dark:text-gray-300"
          >
            <span>{item.quantity}x {item.name}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="price text-h3">${order.total.toFixed(2)}</span>

        {order.estimatedReady && order.status !== 'completed' && (
          <div className="text-right">
            <p className="text-small text-gray-500 dark:text-gray-400">
              Estimated ready
            </p>
            <p className="text-body font-medium text-primary-500">
              {formatTime(order.estimatedReady)}
            </p>
          </div>
        )}

        {order.status === 'completed' && (
          <Button variant="outline" size="sm">
            Reorder
          </Button>
        )}
      </div>
    </Card>
  )
}

function EmptyOrders() {
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
        <ClipboardList className="w-10 h-10 text-gray-400" />
      </div>

      <h2 className="text-h3 font-semibold text-gray-900 dark:text-white">
        No orders yet
      </h2>
      <p className="mt-2 text-body text-gray-500 dark:text-gray-400">
        Your order history will appear here
      </p>

      <Link href="/" className="mt-6">
        <Button>Start Ordering</Button>
      </Link>
    </motion.div>
  )
}
