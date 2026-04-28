'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, formatCondition } from '@/lib/utils'
import {
  ShoppingBag, Package, TrendingUp, Clock,
  Plus, Eye, Edit, Trash2, LayoutDashboard,
  List, X, AlertTriangle, Check, RefreshCw,
  DollarSign, ToggleLeft, ToggleRight, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'
import toast from 'react-hot-toast'

interface Props {
  stats: { totalOrders: number; pendingOrders: number; activeProducts: number; totalRevenue: number }
  recentOrders: any[]
  topProducts: { product: any; totalSold: number }[]
}

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

// ─── DELETE CONFIRM MODAL ───────────────────────────────────────────────────
function DeleteModal({
  product,
  onConfirm,
  onCancel,
  loading,
}: {
  product: any
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111] border border-[#222] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <h3 className="text-[15px] font-medium text-white text-center mb-2">¿Eliminar producto?</h3>
        <p className="text-[12px] text-[#555] text-center mb-1">
          Vas a desactivar:
        </p>
        <p className="text-[12px] text-white text-center font-medium mb-5 px-4 line-clamp-2">{product.name}</p>
        <p className="text-[11px] text-[#444] text-center mb-6">
          El producto dejará de aparecer en la tienda. Podés reactivarlo desde la edición.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-[12px] text-[#666] border border-[#222] rounded-xl hover:border-[#333] hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 text-[12px] text-white bg-red-500/80 hover:bg-red-500 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── INLINE PRICE EDITOR ────────────────────────────────────────────────────
function InlinePriceEditor({
  product,
  onSave,
  onCancel,
}: {
  product: any
  onSave: (price: string, comparePrice: string) => void
  onCancel: () => void
}) {
  const [price, setPrice] = useState(String(Math.round(Number(product.price))))
  const [comparePrice, setComparePrice] = useState(
    product.comparePrice ? String(Math.round(Number(product.comparePrice))) : ''
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div>
        <label className="block text-[9px] text-[#555] mb-0.5">Precio</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-32 bg-[#0d0d0d] border border-[#c9a84c]/40 rounded-lg px-2 py-1 text-[12px] text-white outline-none"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-[9px] text-[#555] mb-0.5">Precio anterior</label>
        <input
          type="number"
          value={comparePrice}
          onChange={e => setComparePrice(e.target.value)}
          placeholder="Opcional"
          className="w-32 bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-2 py-1 text-[12px] text-white outline-none"
        />
      </div>
      <div className="flex gap-1.5 mt-3">
        <button onClick={() => onSave(price, comparePrice)} className="w-7 h-7 bg-[#c9a84c] text-black rounded-lg flex items-center justify-center hover:bg-[#e0c06e] transition-all">
          <Check size={13} />
        </button>
        <button onClick={onCancel} className="w-7 h-7 bg-[#1a1a1a] border border-[#2a2a2a] text-[#666] rounded-lg flex items-center justify-center hover:text-white transition-all">
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export function AdminDashboard({ stats, recentOrders, topProducts }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview')
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [editPriceId, setEditPriceId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loadingDelete, setLoadingDelete] = useState(false)

  const metrics = [
    { label: 'Ventas totales', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-[#c9a84c]' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Pendientes', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-400' },
    { label: 'Activos', value: stats.activeProducts, icon: Package, color: 'text-green-400' },
  ]

  // Delete product (soft delete)
  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoadingDelete(true)
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('Producto desactivado', {
        style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
      })
      setDeleteTarget(null)
      startTransition(() => router.refresh())
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoadingDelete(false)
    }
  }

  // Save price inline
  const handleSavePrice = async (productId: string, price: string, comparePrice: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(price),
          comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('Precio actualizado', {
        icon: '💰',
        style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
      })
      setEditPriceId(null)
      startTransition(() => router.refresh())
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Toggle active/featured
  const handleToggle = async (productId: string, field: 'isActive' | 'isFeatured', currentVal: boolean) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentVal }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success(
        field === 'isActive'
          ? !currentVal ? 'Producto activado' : 'Producto desactivado'
          : !currentVal ? 'Marcado como destacado' : 'Quitado de destacados',
        { style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' } }
      )
      startTransition(() => router.refresh())
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <>
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={loadingDelete}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="container-store py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-white flex items-center gap-2">
                <LayoutDashboard size={20} className="text-[#c9a84c]" />
                Panel Admin
              </h1>
              <p className="text-[11px] text-[#555] mt-0.5">Gestión completa de la tienda</p>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a84c] text-black text-[12px] font-semibold rounded-lg hover:bg-[#e0c06e] transition-all"
            >
              <Plus size={13} /> Nuevo producto
            </Link>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-[#555] uppercase tracking-widest">{m.label}</span>
                  <m.icon size={14} className={m.color} />
                </div>
                <p className="text-xl font-semibold text-white">{m.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#111] border border-[#1a1a1a] rounded-xl p-1 w-fit">
            {[
              { key: 'overview', label: 'Resumen', icon: LayoutDashboard },
              { key: 'orders', label: 'Pedidos', icon: List },
              { key: 'products', label: 'Productos', icon: Package },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all',
                  activeTab === key ? 'bg-[#c9a84c] text-black' : 'text-[#555] hover:text-white'
                )}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Recent orders */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#141414] flex items-center justify-between">
                  <h3 className="text-[13px] font-medium text-white">Últimos pedidos</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-[10px] text-[#c9a84c] hover:underline">Ver todos →</button>
                </div>
                <div className="divide-y divide-[#141414]">
                  {recentOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-white truncate">{order.customerName}</p>
                        <p className="text-[10px] text-[#444] font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] text-white">{formatPrice(Number(order.total))}</p>
                        <span className={cn('text-[9px] px-1.5 py-0.5 rounded border', STATUS_COLORS[order.status as OrderStatus])}>
                          {STATUS_LABELS[order.status as OrderStatus]}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p className="px-5 py-8 text-[12px] text-[#444] text-center">Sin pedidos aún</p>
                  )}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#141414] flex items-center justify-between">
                  <h3 className="text-[13px] font-medium text-white">Más vendidos</h3>
                  <button onClick={() => setActiveTab('products')} className="text-[10px] text-[#c9a84c] hover:underline">Gestionar →</button>
                </div>
                <div className="divide-y divide-[#141414]">
                  {topProducts.map(({ product, totalSold }, i) => (
                    <div key={product.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="text-[11px] text-[#333] w-4 flex-shrink-0">{i + 1}</span>
                      <div className="relative w-9 h-9 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white truncate">{product.name}</p>
                        <p className="text-[10px] text-[#444]">{formatPrice(Number(product.price))}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-[#c9a84c] font-medium">{totalSold} vend.</p>
                        <p className="text-[10px] text-[#333]">{product.stock} stock</p>
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <p className="px-5 py-8 text-[12px] text-[#444] text-center">Sin ventas aún</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#141414]">
                      {['Pedido', 'Cliente', 'Items', 'Total', 'Pago', 'Estado', 'Fecha'].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] text-[#444] uppercase tracking-widest font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#111]">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.015] transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-white font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-white whitespace-nowrap">{order.customerName}</p>
                          <p className="text-[10px] text-[#444] truncate max-w-[120px]">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-[#666]">{order.orderItems?.length || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-white whitespace-nowrap">{formatPrice(Number(order.total))}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] text-[#555]">
                            {order.paymentMethod === 'TRANSFER' ? 'Transferencia' : 'WhatsApp'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap', STATUS_COLORS[order.status as OrderStatus])}>
                            {STATUS_LABELS[order.status as OrderStatus]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] text-[#444] whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentOrders.length === 0 && (
                  <div className="py-16 text-center text-[12px] text-[#444]">Sin pedidos todavía</div>
                )}
              </div>
            </div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-[#555]">{topProducts.length} productos cargados</p>
                <Link href="/admin/products/new" className="text-[11px] text-[#c9a84c] hover:underline flex items-center gap-1">
                  <Plus size={11} /> Agregar nuevo
                </Link>
              </div>

              {topProducts.map(({ product }) => (
                <motion.div
                  key={product.id}
                  layout
                  className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] rounded-xl overflow-hidden flex-shrink-0 border border-[#222]">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#333]">
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-medium text-white leading-snug line-clamp-2">{product.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[10px] text-[#444]">{formatCondition(product.condition)}</span>
                            <span className="text-[10px] text-[#333]">·</span>
                            <span className={cn('text-[10px]', product.stock <= 3 ? 'text-red-400' : 'text-[#555]')}>
                              {product.stock} en stock{product.stock <= 3 && product.stock > 0 ? ' ⚠️' : ''}
                              {product.stock === 0 ? ' — Sin stock' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Toggle featured */}
                          <button
                            title={product.isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                            onClick={() => handleToggle(product.id, 'isFeatured', product.isFeatured)}
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center transition-all border',
                              product.isFeatured
                                ? 'bg-[#c9a84c]/15 border-[#c9a84c]/30 text-[#c9a84c]'
                                : 'bg-[#1a1a1a] border-[#222] text-[#444] hover:text-[#c9a84c]'
                            )}
                          >
                            <Star size={13} fill={product.isFeatured ? 'currentColor' : 'none'} />
                          </button>

                          {/* Toggle active */}
                          <button
                            title={product.isActive ? 'Desactivar' : 'Activar'}
                            onClick={() => handleToggle(product.id, 'isActive', product.isActive)}
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center transition-all border',
                              product.isActive
                                ? 'bg-green-500/10 border-green-500/25 text-green-400'
                                : 'bg-[#1a1a1a] border-[#222] text-[#444]'
                            )}
                          >
                            {product.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                          </button>

                          {/* View product */}
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[#555] hover:text-white transition-all"
                            title="Ver en tienda"
                          >
                            <Eye size={13} />
                          </Link>

                          {/* Edit product */}
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[#555] hover:text-[#c9a84c] transition-all"
                            title="Editar producto"
                          >
                            <Edit size={13} />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[#555] hover:text-red-400 hover:border-red-400/30 transition-all"
                            title="Eliminar producto"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Price area */}
                      <div className="mt-3">
                        {editPriceId === product.id ? (
                          <InlinePriceEditor
                            product={product}
                            onSave={(price, comparePrice) => handleSavePrice(product.id, price, comparePrice)}
                            onCancel={() => setEditPriceId(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-semibold text-white">
                              {formatPrice(Number(product.price))}
                            </span>
                            {product.comparePrice && (
                              <span className="text-[11px] text-[#333] line-through">
                                {formatPrice(Number(product.comparePrice))}
                              </span>
                            )}
                            <button
                              onClick={() => setEditPriceId(product.id)}
                              className="flex items-center gap-1 text-[10px] text-[#444] hover:text-[#c9a84c] transition-colors ml-1 border border-[#1e1e1e] rounded-md px-2 py-0.5 hover:border-[#c9a84c]/30"
                              title="Editar precio"
                            >
                              <DollarSign size={10} /> Editar precio
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="px-4 pb-3 flex items-center gap-3">
                    {!product.isActive && (
                      <span className="text-[9px] text-[#ef4444] bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                        Desactivado
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="text-[9px] text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2 py-0.5 rounded-full">
                        ★ Destacado
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-[9px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {topProducts.length === 0 && (
                <div className="bg-[#111] border border-[#1a1a1a] rounded-xl py-16 text-center">
                  <Package size={32} className="text-[#222] mx-auto mb-3" />
                  <p className="text-[13px] text-white mb-2">No hay productos cargados</p>
                  <Link href="/admin/products/new" className="text-[12px] text-[#c9a84c] hover:underline">
                    Agregar el primero →
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
