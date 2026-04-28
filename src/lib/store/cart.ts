'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LocalCartItem, CartProduct } from '@/types'
import toast from 'react-hot-toast'

interface CartStore {
  items: LocalCartItem[]
  isOpen: boolean

  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id)

        if (existing) {
          const newQty = existing.quantity + quantity
          if (newQty > product.stock) {
            toast.error(`Solo hay ${product.stock} unidades disponibles`)
            return
          }
          set({
            items: items.map(i =>
              i.product.id === product.id ? { ...i, quantity: newQty } : i
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }

        toast.success('Producto agregado al carrito', {
          icon: '🛒',
          style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
        })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) })
        toast.success('Producto eliminado', {
          style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'iphone-store-cart',
    }
  )
)
