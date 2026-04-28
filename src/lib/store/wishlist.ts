'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

interface WishlistStore {
  items: string[] // product IDs
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleItem: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  count: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set({ items: [...get().items, productId] })
        toast.success('Agregado a favoritos', {
          icon: '♡',
          style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
        })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(id => id !== productId) })
        toast.success('Eliminado de favoritos', {
          style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
        })
      },

      toggleItem: (productId) => {
        if (get().isWishlisted(productId)) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      isWishlisted: (productId) => get().items.includes(productId),
      count: () => get().items.length,
    }),
    { name: 'iphone-store-wishlist' }
  )
)
