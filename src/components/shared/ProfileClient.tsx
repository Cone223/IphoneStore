'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, LogOut, ShoppingBag, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'En proceso',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  CONFIRMED: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PROCESSING: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  DELIVERED: 'text-green-400 bg-green-400/10 border-green-400/20',
  CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
}

interface Props {
  user: { id: string; name?: string; email?: string; image?: string; role?: string }
  orders: any[]
}

export function ProfileClient({ user, orders }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container-store py-8 max-w-2xl">
        <h1 className="font-serif text-2xl text-white mb-6">Mi cuenta</h1>

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden flex items-center justify-center flex-shrink-0">
              {user.image ? (
                <Image src={user.image} alt="" fill className="object-cover" />
              ) : (
                <User size={20} className="text-[#555]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-white">{user.name || 'Sin nombre'}</p>
              <p className="text-[12px] text-[#555]">{user.email}</p>
              {user.role === 'ADMIN' && (
                <span className="inline-block mt-1 text-[9px] bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] px-2 py-0.5 rounded-full tracking-widest uppercase">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-[#ef4444] transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="mt-4 flex items-center justify-between px-4 py-3 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl hover:bg-[#c9a84c]/10 transition-all"
            >
              <span className="text-[12px] text-[#c9a84c]">Ir al Panel Admin</span>
              <ChevronRight size={14} className="text-[#c9a84c]" />
            </Link>
          )}
        </motion.div>

        {/* Orders */}
        <div>
          <h2 className="text-[13px] font-medium text-white mb-4 flex items-center gap-2">
            <Package size={14} className="text-[#c9a84c]" />
            Mis pedidos ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-10 text-center">
              <ShoppingBag size={32} className="text-[#2a2a2a] mx-auto mb-3" />
              <p className="text-[13px] text-[#555]">Todavía no tenés pedidos</p>
              <Link href="/catalog" className="mt-3 inline-block text-[12px] text-[#c9a84c] hover:underline">
                Ver productos →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#111] border border-[#1e1e1e] rounded-xl overflow-hidden"
                >
                  {/* Order header */}
                  <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] text-white font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className="ml-2 text-[10px] text-[#555]">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', STATUS_COLORS[order.status as OrderStatus])}>
                        {STATUS_LABELS[order.status as OrderStatus]}
                      </span>
                      <span className="text-[13px] font-medium text-white">{formatPrice(Number(order.total))}</span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-4 space-y-2">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images[0] && (
                            <Image src={item.product.images[0]} alt="" fill className="object-contain p-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-[#555]">x{item.quantity} · {formatPrice(Number(item.price))}</p>
                        </div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-[10px] text-[#c9a84c] hover:underline flex-shrink-0"
                        >
                          Ver →
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Payment method */}
                  <div className="px-4 pb-3">
                    <p className="text-[10px] text-[#555]">
                      Pago: {order.paymentMethod === 'TRANSFER' ? 'Transferencia' : 'WhatsApp'} ·
                      Envío: {order.shippingType === 'PICKUP' ? 'Retiro en persona' : 'Envío a domicilio'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
