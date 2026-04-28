import { Product, User, Order, OrderItem, CartItem, WishlistItem } from '@prisma/client'

// Re-exports for convenience
export type { Product, User, Order, OrderItem, CartItem, WishlistItem }

// Extended types
export type ProductWithRelations = Product & {
  orderItems?: OrderItem[]
  cartItems?: CartItem[]
  wishlistItems?: WishlistItem[]
}

export type OrderWithItems = Order & {
  orderItems: (OrderItem & { product: Product })[]
  user: User
}

export type CartItemWithProduct = CartItem & {
  product: Product
}

export type WishlistItemWithProduct = WishlistItem & {
  product: Product
}

// Filter types
export interface ProductFilters {
  model?: string[]
  storage?: string[]
  condition?: string[]
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

// Cart store types
export interface CartProduct {
  id: string
  name: string
  price: number
  image: string
  stock: number
  model: string
  storage: string
  color: string
  condition: string
}

export interface LocalCartItem {
  product: CartProduct
  quantity: number
}

// Checkout types
export interface CheckoutData {
  paymentMethod: 'TRANSFER' | 'WHATSAPP'
  shippingType: 'PICKUP' | 'DELIVERY'
  shippingAddress?: {
    street: string
    city: string
    province: string
    postalCode: string
  }
  customerName: string
  customerPhone?: string
  notes?: string
}

// WhatsApp types
export interface WhatsAppMessage {
  productName: string
  price: number
  quantity: number
  customerName: string
  customerPhone?: string
  orderId?: string
}

// Admin dashboard types
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeProducts: number
  pendingOrders: number
  recentOrders: OrderWithItems[]
  topProducts: { product: Product; totalSold: number }[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
