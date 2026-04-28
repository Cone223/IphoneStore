'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-[#d2d2d7] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8ed]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#0071e3]" />
                <span className="text-[14px] font-semibold text-[#1d1d1f]">Carrito</span>
                {totalItems() > 0 && (
                  <span className="text-[11px] text-[#6e6e73] bg-[#f5f5f7] px-2 py-0.5 rounded-full">
                    {totalItems()} {totalItems() === 1 ? 'producto' : 'productos'}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-[#aeaeb2]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d1d1f] mb-1">Tu carrito está vacío</p>
                    <p className="text-[12px] text-[#6e6e73]">Agregá productos para continuar</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 text-[12px] bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ed] transition-colors"
                  >
                    Ver catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map(({ product, quantity }) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl"
                      >
                        <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-[#e8e8ed]">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 mb-0.5">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-[#6e6e73]">{product.color}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-[12px] text-[#1d1d1f] w-4 text-center font-medium">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                disabled={quantity >= product.stock}
                                className="w-6 h-6 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all disabled:opacity-30"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-[#1d1d1f]">
                                {formatPrice(product.price * quantity)}
                              </span>
                              <button onClick={() => removeItem(product.id)} className="text-[#aeaeb2] hover:text-[#ff3b30] transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#e8e8ed] px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6e6e73]">Subtotal</span>
                  <span className="text-[16px] font-bold text-[#1d1d1f]">{formatPrice(totalPrice())}</span>
                </div>
                <p className="text-[11px] text-[#aeaeb2]">Envío y descuentos se calculan en el checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0071e3] text-white text-[13px] font-semibold rounded-full hover:bg-[#0077ed] transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Finalizar compra <ArrowRight size={14} />
                </Link>
                <button onClick={closeCart} className="w-full py-2 text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
