'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@prisma/client'
import {
  ShoppingCart, Heart, MessageCircle, ShieldCheck,
  Truck, Award, ChevronLeft, ChevronRight, Check, Minus, Plus
} from 'lucide-react'
import { formatPrice, formatCondition, formatModel, formatStorage, getConditionColor, generateWhatsAppLink, cn } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

interface Props { product: Product }

export function ProductDetail({ product }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)
  const toggleItem = useWishlistStore(s => s.toggleItem)
  const isWishlisted = useWishlistStore(s => s.isWishlisted(product.id))

  const images = product.images.length > 0 ? product.images : ['/placeholder-iphone.jpg']
  const discount = product.comparePrice
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0],
      stock: product.stock,
      model: product.model,
      storage: product.storage,
      color: product.color,
      condition: product.condition,
    }, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    openCart()
  }

  const waLink = generateWhatsAppLink({
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678',
    productName: product.name,
    price: Number(product.price),
    quantity,
    customerName: 'cliente',
  })

  return (
    <section className="container-store py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setActiveImage(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border transition-all',
                    activeImage === i
                      ? 'border-[#c9a84c]'
                      : 'border-[#1e1e1e] opacity-50 hover:opacity-100'
                  )}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Condition badge */}
          <span className={cn('self-start text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full border mb-3', getConditionColor(product.condition))}>
            {formatCondition(product.condition)}
          </span>

          <h1 className="font-serif text-2xl md:text-3xl font-normal text-white leading-tight mb-2">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-2 text-[11px] text-[#555] mb-5">
            <span>{formatModel(product.model)}</span>
            <span>·</span>
            <span>{formatStorage(product.storage)}</span>
            <span>·</span>
            <span>{product.color}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-medium text-white">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && (
              <span className="text-[15px] text-[#444] line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
            {discount && (
              <span className="text-[12px] bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] px-2 py-0.5 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1.5 mb-6">
            {product.stock > 0 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[12px] text-[#666]">
                  {product.stock <= 3
                    ? `¡Solo quedan ${product.stock} unidades!`
                    : `${product.stock} unidades disponibles`}
                </span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[12px] text-[#ef4444]">Sin stock</span>
              </>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[12px] text-[#555]">Cantidad:</span>
              <div className="flex items-center gap-2 bg-[#111] border border-[#1e1e1e] rounded-lg p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-[#555] hover:text-white hover:bg-white/5 transition-all"
                >
                  <Minus size={13} />
                </button>
                <span className="text-[13px] text-white w-6 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-[#555] hover:text-white hover:bg-white/5 transition-all"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-medium transition-all',
                product.stock === 0
                  ? 'bg-[#1a1a1a] text-[#444] cursor-not-allowed'
                  : addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-[#c9a84c] text-black hover:bg-[#e0c06e] hover:scale-[1.01] active:scale-[0.99]'
              )}
            >
              {addedToCart ? (
                <><Check size={16} /> Agregado al carrito</>
              ) : (
                <><ShoppingCart size={16} /> Agregar al carrito</>
              )}
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-medium border border-[#1e1e1e] text-[#888] hover:text-white hover:border-[#333] hover:bg-white/5 transition-all"
            >
              <MessageCircle size={16} className="text-[#25d366]" />
              Comprar por WhatsApp
            </a>

            <button
              onClick={() => toggleItem(product.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] text-[#555] hover:text-white transition-colors"
            >
              <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-[#c9a84c]' : ''} />
              {isWishlisted ? 'En tus favoritos' : 'Agregar a favoritos'}
            </button>
          </div>

          {/* Trust */}
          <div className="border-t border-[#1a1a1a] pt-5 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: 'Garantía', sub: '3 meses' },
              { icon: Truck, label: 'Envío', sub: 'A todo el país' },
              { icon: Award, label: 'Certificado', sub: 'Revisado y probado' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="text-center">
                <Icon size={18} className="text-[#c9a84c] mx-auto mb-1" />
                <p className="text-[11px] font-medium text-white">{label}</p>
                <p className="text-[10px] text-[#555]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-[#1a1a1a] mt-6 pt-6">
            <h3 className="text-[13px] font-medium text-white mb-3">Descripción</h3>
            <p className="text-[13px] text-[#666] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="border-t border-[#1a1a1a] mt-6 pt-6">
              <h3 className="text-[13px] font-medium text-white mb-3">Características</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#666]">
                    <Check size={12} className="text-[#c9a84c] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
