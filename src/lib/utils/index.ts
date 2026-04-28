import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IPhoneModel, StorageOption, Condition } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatModel(model: IPhoneModel): string {
  const map: Record<IPhoneModel, string> = {
    IPHONE_11: 'iPhone 11',
    IPHONE_11_PRO: 'iPhone 11 Pro',
    IPHONE_11_PRO_MAX: 'iPhone 11 Pro Max',
    IPHONE_12: 'iPhone 12',
    IPHONE_12_PRO: 'iPhone 12 Pro',
    IPHONE_12_PRO_MAX: 'iPhone 12 Pro Max',
    IPHONE_13: 'iPhone 13',
    IPHONE_13_PRO: 'iPhone 13 Pro',
    IPHONE_13_PRO_MAX: 'iPhone 13 Pro Max',
    IPHONE_14: 'iPhone 14',
    IPHONE_14_PRO: 'iPhone 14 Pro',
    IPHONE_14_PRO_MAX: 'iPhone 14 Pro Max',
    IPHONE_15: 'iPhone 15',
    IPHONE_15_PRO: 'iPhone 15 Pro',
    IPHONE_15_PRO_MAX: 'iPhone 15 Pro Max',
  }
  return map[model] || model
}

export function formatStorage(storage: StorageOption): string {
  const map: Record<StorageOption, string> = {
    GB_64: '64GB',
    GB_128: '128GB',
    GB_256: '256GB',
    GB_512: '512GB',
    TB_1: '1TB',
  }
  return map[storage] || storage
}

export function formatCondition(condition: Condition): string {
  const map: Record<Condition, string> = {
    NEW: 'Nuevo',
    LIKE_NEW: 'Como nuevo',
    EXCELLENT: 'Excelente',
    GOOD: 'Buen estado',
    FAIR: 'Aceptable',
  }
  return map[condition] || condition
}

export function getConditionColor(condition: Condition): string {
  const map: Record<Condition, string> = {
    NEW: 'text-green-400 border-green-400/30 bg-green-400/10',
    LIKE_NEW: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    EXCELLENT: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    GOOD: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    FAIR: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  }
  return map[condition] || ''
}

export function generateWhatsAppLink(params: {
  phone: string
  productName: string
  price: number
  quantity: number
  customerName: string
}): string {
  const message = encodeURIComponent(
    `¡Hola! Quiero comprar:\n\n` +
    `📱 *${params.productName}*\n` +
    `💰 Precio: ${formatPrice(params.price)}\n` +
    `📦 Cantidad: ${params.quantity}\n` +
    `👤 Mi nombre: ${params.customerName}\n\n` +
    `¿Podés confirmarme disponibilidad y forma de pago?`
  )
  return `https://wa.me/${params.phone}?text=${message}`
}

export function generateOrderWhatsAppLink(params: {
  phone: string
  orderId: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  customerName: string
}): string {
  const itemsList = params.items
    .map(item => `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join('\n')

  const message = encodeURIComponent(
    `¡Hola! Quiero finalizar mi pedido #${params.orderId.slice(-8).toUpperCase()}\n\n` +
    `👤 *${params.customerName}*\n\n` +
    `🛒 *Productos:*\n${itemsList}\n\n` +
    `💰 *Total: ${formatPrice(params.total)}*\n\n` +
    `¿Me podés confirmar los datos de pago?`
  )
  return `https://wa.me/${params.phone}?text=${message}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function calculateShipping(postalCode: string): number {
  // Mock shipping calculation
  const capital = ['1000', '1001', '1999']
  const isCapital = capital.some(c => postalCode.startsWith(c.slice(0, 3)))
  if (isCapital) return 2500
  return 5900
}
