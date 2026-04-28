'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@prisma/client'
import { formatPrice, formatCondition, formatModel, formatStorage, cn } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

const CONDITION_BADGE: Record<string, { label: string; class: string }> = {
  NEW:       { label: 'Nuevo',       class: 'bg-[#34c759] text-white' },
  LIKE_NEW:  { label: 'Como nuevo',  class: 'bg-[#30d158] text-white' },
  EXCELLENT: { label: 'Excelente',   class: 'bg-[#0071e3] text-white' },
  GOOD:      { label: 'Buen estado', class: 'bg-[#ff9500] text-white' },
  FAIR:      { label: 'Aceptable',   class: 'bg-[#ff6b00] text-white' },
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false)
  const addItem      = useCartStore(s => s.addItem)
  const toggleItem   = useWishlistStore(s => s.toggleItem)
  const isWishlisted = useWishlistStore(s => s.isWishlisted(product.id))

  const badge    = CONDITION_BADGE[product.condition]
  const discount = product.comparePrice
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || '/placeholder-iphone.svg',
      stock: product.stock,
      model: product.model,
      storage: product.storage,
      color: product.color,
      condition: product.condition,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`} className="block group">
        <div className="bg-white border border-[#d2d2d7] rounded-2xl overflow-hidden transition-all duration-250 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-[3px]">

          {/* Image area */}
          <div className="relative bg-[#f5f5f7] aspect-square flex items-center justify-center overflow-hidden p-8">
            <Image
              src={product.images[0] || '/placeholder-iphone.svg'}
              alt={product.name}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="(max-width:768px) 50vw, 25vw"
            />

            {/* Condition badge */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              <span className={cn('text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md', badge.class)}>
                {badge.label}
              </span>
              {discount && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#ff3b30] text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={cn(
                'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all border opacity-0 group-hover:opacity-100',
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-[#ff3b30] opacity-100'
                  : 'bg-white border-[#d2d2d7] text-[#6e6e73] hover:text-[#ff3b30]'
              )}
            >
              <Heart size={13} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-[11px] text-[#6e6e73] border border-[#d2d2d7] bg-white px-3 py-1 rounded-full">
                  Sin stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3.5">
            <p className="text-[10px] text-[#6e6e73] uppercase tracking-[0.06em] mb-1">
              {formatModel(product.model)}
            </p>
            <h3 className="text-[13.5px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 mb-1 group-hover:text-[#0071e3] transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-[#6e6e73] mb-3">
              {formatStorage(product.storage)} · {product.color}
            </p>

            {/* Price row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-[#1d1d1f]">
                  {formatPrice(Number(product.price))}
                </span>
                {product.comparePrice && (
                  <span className="ml-1.5 text-[11px] text-[#aeaeb2] line-through">
                    {formatPrice(Number(product.comparePrice))}
                  </span>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all text-white text-[16px] font-light',
                  product.stock === 0
                    ? 'bg-[#e8e8ed] cursor-not-allowed'
                    : added
                    ? 'bg-[#34c759]'
                    : 'bg-[#0071e3] hover:bg-[#0077ed] hover:scale-110 active:scale-95'
                )}
              >
                {added ? <Check size={14} /> : <ShoppingCart size={14} />}
              </button>
            </div>

            {/* Low stock warning */}
            {product.stock > 0 && product.stock <= 3 && (
              <p className="text-[10px] text-[#ff3b30] mt-1.5">¡Solo quedan {product.stock}!</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
      <div className="aspect-square bg-[#f5f5f7] shimmer" />
      <div className="p-3.5 space-y-2">
        <div className="h-2.5 w-16 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-3 w-20 skeleton rounded" />
        <div className="h-5 w-28 skeleton rounded mt-3" />
      </div>
    </div>
  )
}
