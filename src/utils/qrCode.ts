/**
 * QR Code Utilities
 * Generates and manages QR codes for table ordering
 */

export interface QRCodeData {
  tableId: string
  restaurantId: string
  baseUrl: string
}

/**
 * Generate a URL for QR code scanning
 */
export function generateTableUrl(data: QRCodeData): string {
  const url = new URL(data.baseUrl)
  url.searchParams.set('table', data.tableId)
  url.searchParams.set('restaurant', data.restaurantId)
  return url.toString()
}

/**
 * Parse table information from URL
 */
export function parseTableUrl(url: string): QRCodeData | null {
  try {
    const parsed = new URL(url)
    const tableId = parsed.searchParams.get('table')
    const restaurantId = parsed.searchParams.get('restaurant')

    if (!tableId || !restaurantId) return null

    return {
      tableId,
      restaurantId,
      baseUrl: `${parsed.origin}${parsed.pathname}`,
    }
  } catch {
    return null
  }
}

/**
 * Generate a unique table session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Validate table ID format
 */
export function isValidTableId(tableId: string): boolean {
  // Table IDs should be alphanumeric, 1-20 characters
  return /^[a-zA-Z0-9]{1,20}$/.test(tableId)
}
