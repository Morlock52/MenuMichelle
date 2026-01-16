'use client'

import { QRCodeSVG } from 'qrcode.react'
import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'
import { generateTableUrl } from '@/utils/qrCode'

interface QRCodeDisplayProps {
  tableId: string
  restaurantId?: string
  size?: number
  className?: string
}

export function QRCodeDisplay({
  tableId,
  restaurantId = 'michelles-kitchen',
  size = 200,
  className,
}: QRCodeDisplayProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://menu.michelles.kitchen'

  const url = generateTableUrl({
    tableId,
    restaurantId,
    baseUrl,
  })

  return (
    <Card className={clsx('inline-block p-6', className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-lg">
          <QRCodeSVG
            value={url}
            size={size}
            level="H"
            includeMargin={false}
            fgColor="#1A1A1A"
            bgColor="#FFFFFF"
          />
        </div>

        <div className="text-center">
          <p className="text-h3 font-bold text-gray-900 dark:text-white">
            Table {tableId}
          </p>
          <p className="text-caption text-gray-500 dark:text-gray-400">
            Scan to view menu & order
          </p>
        </div>
      </div>
    </Card>
  )
}
