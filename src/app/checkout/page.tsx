'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2, MessageCircle, MapPin, Package,
  ChevronRight, Check, Copy, ArrowLeft, User, Phone
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice, generateOrderWhatsAppLink, calculateShipping, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type Step = 'contact' | 'shipping' | 'payment' | 'confirm'
type PaymentMethod = 'TRANSFER' | 'WHATSAPP'
type ShippingType = 'PICKUP' | 'DELIVERY'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const [step, setStep] = useState<Step>('contact')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [contact, setContact] = useState({
    name: session?.user?.name || '',
    phone: '',
  })
  const [shipping, setShipping] = useState<ShippingType>('PICKUP')
  const [address, setAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('TRANSFER')

  const shippingCost = shipping === 'DELIVERY' ? calculateShipping(address.postalCode) : 0
  const total = totalPrice() + shippingCost

  const CBU = process.env.NEXT_PUBLIC_CBU || '0000003100012345678901'
  const ALIAS = process.env.NEXT_PUBLIC_ALIAS || 'iphone.store.ventas'
  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-[15px] text-white mb-2">Tu carrito está vacío</p>
          <Link href="/catalog" className="text-[13px] text-[#c9a84c] hover:underline">
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  const handleCreateOrder = async () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/checkout')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: payment,
          shippingType: shipping,
          shippingAddress: shipping === 'DELIVERY' ? address : null,
          customerName: contact.name,
          customerPhone: contact.phone,
          items: items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          subtotal: totalPrice(),
          shippingCost,
          total,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setOrderId(data.data.id)
      setStep('confirm')
      clearCart()
    } catch (err: any) {
      toast.error(err.message || 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado al portapapeles')
    setTimeout(() => setCopied(false), 2000)
  }

  const waLink = orderId
    ? generateOrderWhatsAppLink({
        phone: WA_NUMBER,
        orderId,
        items: items.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total,
        customerName: contact.name,
      })
    : '#'

  const steps: Step[] = ['contact', 'shipping', 'payment', 'confirm']
  const stepLabels: Record<Step, string> = {
    contact: 'Contacto',
    shipping: 'Envío',
    payment: 'Pago',
    confirm: 'Confirmación',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container-store py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-serif text-2xl text-white">Checkout</h1>
        </div>

        {/* Step indicator */}
        {step !== 'confirm' && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar">
            {steps.slice(0, -1).map((s, i) => {
              const currentIdx = steps.indexOf(step)
              const isDone = steps.indexOf(s) < currentIdx
              const isActive = s === step
              return (
                <div key={s} className="flex items-center gap-2 flex-shrink-0">
                  <div className={cn(
                    'flex items-center gap-1.5 text-[12px] transition-colors',
                    isActive ? 'text-white' : isDone ? 'text-[#c9a84c]' : 'text-[#555]'
                  )}>
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-medium',
                      isActive ? 'border-white text-white' : isDone ? 'border-[#c9a84c] bg-[#c9a84c] text-black' : 'border-[#333] text-[#555]'
                    )}>
                      {isDone ? <Check size={10} /> : i + 1}
                    </div>
                    <span className="hidden sm:block">{stepLabels[s]}</span>
                  </div>
                  {i < 2 && <ChevronRight size={12} className="text-[#333]" />}
                </div>
              )
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main form */}
          <div>
            <AnimatePresence mode="wait">
              {/* CONTACT */}
              {step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
                    <h2 className="text-[15px] font-medium text-white flex items-center gap-2">
                      <User size={15} className="text-[#c9a84c]" /> Tus datos
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Nombre completo</label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                          placeholder="Juan Pérez"
                          className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Teléfono (opcional)</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                          placeholder="+54 9 11 1234-5678"
                          className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                        />
                      </div>
                      {!session && (
                        <p className="text-[11px] text-[#555] bg-[#1a1a1a] rounded-lg px-3 py-2">
                          💡 <Link href="/auth/login?callbackUrl=/checkout" className="text-[#c9a84c] hover:underline">Ingresá</Link> para guardar tu historial de pedidos.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => contact.name && setStep('shipping')}
                      disabled={!contact.name}
                      className="w-full py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SHIPPING */}
              {step === 'shipping' && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
                    <h2 className="text-[15px] font-medium text-white flex items-center gap-2">
                      <Package size={15} className="text-[#c9a84c]" /> Método de entrega
                    </h2>
                    <div className="grid gap-3">
                      {[
                        { value: 'PICKUP' as ShippingType, label: 'Retiro en persona', sub: 'Gratis · Coordinar punto de encuentro', icon: MapPin },
                        { value: 'DELIVERY' as ShippingType, label: 'Envío a domicilio', sub: 'Calculado por código postal', icon: Package },
                      ].map(({ value, label, sub, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setShipping(value)}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                            shipping === value
                              ? 'border-[#c9a84c]/40 bg-[#c9a84c]/5'
                              : 'border-[#1e1e1e] hover:border-[#2a2a2a]'
                          )}
                        >
                          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', shipping === value ? 'bg-[#c9a84c]/10' : 'bg-[#1a1a1a]')}>
                            <Icon size={16} className={shipping === value ? 'text-[#c9a84c]' : 'text-[#555]'} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-white">{label}</p>
                            <p className="text-[11px] text-[#555]">{sub}</p>
                          </div>
                          {shipping === value && <Check size={14} className="text-[#c9a84c]" />}
                        </button>
                      ))}
                    </div>

                    {shipping === 'DELIVERY' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Dirección</label>
                            <input
                              type="text"
                              value={address.street}
                              onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                              placeholder="Av. Corrientes 1234"
                              className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Ciudad</label>
                            <input
                              type="text"
                              value={address.city}
                              onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                              placeholder="Buenos Aires"
                              className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Código postal</label>
                            <input
                              type="text"
                              value={address.postalCode}
                              onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                              placeholder="1414"
                              className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                            />
                          </div>
                        </div>
                        {address.postalCode.length >= 4 && (
                          <p className="text-[12px] text-[#c9a84c] bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg px-3 py-2">
                            Costo de envío estimado: {formatPrice(calculateShipping(address.postalCode))}
                          </p>
                        )}
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep('contact')} className="px-4 py-2.5 text-[12px] text-[#555] border border-[#1e1e1e] rounded-xl hover:border-[#333] hover:text-white transition-all">
                        ← Volver
                      </button>
                      <button
                        onClick={() => setStep('payment')}
                        className="flex-1 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all"
                      >
                        Continuar →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAYMENT */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
                    <h2 className="text-[15px] font-medium text-white flex items-center gap-2">
                      <Building2 size={15} className="text-[#c9a84c]" /> Método de pago
                    </h2>
                    <div className="grid gap-3">
                      {[
                        {
                          value: 'TRANSFER' as PaymentMethod,
                          label: 'Transferencia bancaria',
                          sub: 'Alias o CBU · Confirmación en 24hs',
                          icon: Building2,
                        },
                        {
                          value: 'WHATSAPP' as PaymentMethod,
                          label: 'Coordinar por WhatsApp',
                          sub: 'Hablá directo con nosotros',
                          icon: MessageCircle,
                        },
                      ].map(({ value, label, sub, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setPayment(value)}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                            payment === value
                              ? 'border-[#c9a84c]/40 bg-[#c9a84c]/5'
                              : 'border-[#1e1e1e] hover:border-[#2a2a2a]'
                          )}
                        >
                          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', payment === value ? 'bg-[#c9a84c]/10' : 'bg-[#1a1a1a]')}>
                            <Icon size={16} className={payment === value ? 'text-[#c9a84c]' : 'text-[#555]'} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-white">{label}</p>
                            <p className="text-[11px] text-[#555]">{sub}</p>
                          </div>
                          {payment === value && <Check size={14} className="text-[#c9a84c]" />}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep('shipping')} className="px-4 py-2.5 text-[12px] text-[#555] border border-[#1e1e1e] rounded-xl hover:border-[#333] hover:text-white transition-all">
                        ← Volver
                      </button>
                      <button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="flex-1 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all disabled:opacity-60"
                      >
                        {loading ? 'Procesando...' : 'Confirmar pedido'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CONFIRM */}
              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 text-center space-y-5">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Check size={28} className="text-green-400" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-white mb-2">¡Pedido confirmado!</h2>
                      <p className="text-[13px] text-[#555]">
                        Número de pedido: <span className="text-white font-mono">{orderId?.slice(-8).toUpperCase()}</span>
                      </p>
                    </div>

                    {payment === 'TRANSFER' && (
                      <div className="text-left bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-5 space-y-3">
                        <p className="text-[12px] font-medium text-[#c9a84c] uppercase tracking-widest mb-3">Datos de transferencia</p>
                        {[
                          { label: 'Alias', value: ALIAS },
                          { label: 'CBU', value: CBU },
                          { label: 'Titular', value: 'iPhone Store SRL' },
                          { label: 'Total', value: formatPrice(total) },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-[11px] text-[#555]">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] text-white font-mono">{value}</span>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="text-[#555] hover:text-[#c9a84c] transition-colors"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <p className="text-[11px] text-[#555] pt-2 border-t border-[#1a1a1a]">
                          Una vez realizada la transferencia, envianos el comprobante por WhatsApp para confirmar tu pedido.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5">
                      {payment === 'WHATSAPP' || true ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 bg-[#25d366] text-white text-[13px] font-medium rounded-xl hover:bg-[#22c55e] transition-all"
                        >
                          <MessageCircle size={16} />
                          Enviar pedido por WhatsApp
                        </a>
                      ) : null}
                      <Link
                        href="/profile"
                        className="py-3 text-[12px] text-[#555] hover:text-white transition-colors block"
                      >
                        Ver mis pedidos →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          {step !== 'confirm' && (
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
                <h3 className="text-[13px] font-medium text-white mb-4">Resumen del pedido</h3>
                <div className="space-y-3 mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={product.image} alt="" fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white leading-snug line-clamp-2">{product.name}</p>
                        <p className="text-[10px] text-[#555] mt-0.5">x{quantity}</p>
                      </div>
                      <span className="text-[12px] text-white flex-shrink-0">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1a1a1a] pt-3 space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#555]">Subtotal</span>
                    <span className="text-white">{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#555]">Envío</span>
                    <span className="text-white">
                      {shipping === 'PICKUP' ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[14px] font-medium pt-2 border-t border-[#1a1a1a]">
                    <span className="text-white">Total</span>
                    <span className="text-[#c9a84c]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
