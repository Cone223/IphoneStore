'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const MODELS = [
  'IPHONE_11', 'IPHONE_11_PRO', 'IPHONE_11_PRO_MAX',
  'IPHONE_12', 'IPHONE_12_PRO', 'IPHONE_12_PRO_MAX',
  'IPHONE_13', 'IPHONE_13_PRO', 'IPHONE_13_PRO_MAX',
  'IPHONE_14', 'IPHONE_14_PRO', 'IPHONE_14_PRO_MAX',
  'IPHONE_15', 'IPHONE_15_PRO', 'IPHONE_15_PRO_MAX',
]
const STORAGES = ['GB_64', 'GB_128', 'GB_256', 'GB_512', 'TB_1']
const CONDITIONS = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR']

interface ProductFormProps {
  initialData?: any
  mode: 'create' | 'edit'
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState('')

  const [form, setForm] = useState({
    name: initialData?.name || '',
    model: initialData?.model || 'IPHONE_15',
    storage: initialData?.storage || 'GB_128',
    color: initialData?.color || '',
    condition: initialData?.condition || 'NEW',
    price: initialData?.price?.toString() || '',
    comparePrice: initialData?.comparePrice?.toString() || '',
    description: initialData?.description || '',
    shortDesc: initialData?.shortDesc || '',
    stock: initialData?.stock?.toString() || '0',
    images: (initialData?.images || []) as string[],
    features: (initialData?.features || []) as string[],
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const addFeature = () => {
    if (newFeature.trim()) {
      update('features', [...form.features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (i: number) => {
    update('features', form.features.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
      }
      const url = mode === 'create' ? '/api/products' : `/api/products/${initialData.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success(mode === 'create' ? 'Producto creado' : 'Producto actualizado', {
        style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' },
      })
      router.push('/admin')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
  const labelClass = "block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container-store py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-serif text-2xl text-white">
            {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h3 className="text-[13px] font-medium text-white">Información básica</h3>

            <div>
              <label className={labelClass}>Nombre del producto</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="iPhone 15 Pro Max 256GB Negro" className={inputClass} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Modelo</label>
                <select value={form.model} onChange={e => update('model', e.target.value)} className={inputClass}>
                  {MODELS.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Almacenamiento</label>
                <select value={form.storage} onChange={e => update('storage', e.target.value)} className={inputClass}>
                  {STORAGES.map(s => <option key={s} value={s}>{s.replace('_', '')}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select value={form.condition} onChange={e => update('condition', e.target.value)} className={inputClass}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Color</label>
              <input type="text" value={form.color} onChange={e => update('color', e.target.value)} required placeholder="Negro Titanio" className={inputClass} />
            </div>
          </motion.div>

          {/* Pricing & Stock */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h3 className="text-[13px] font-medium text-white">Precio y stock</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Precio ($)</label>
                <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required placeholder="1899000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Precio anterior ($)</label>
                <input type="number" value={form.comparePrice} onChange={e => update('comparePrice', e.target.value)} placeholder="2100000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} required min="0" className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h3 className="text-[13px] font-medium text-white">Descripción</h3>
            <div>
              <label className={labelClass}>Descripción corta</label>
              <input type="text" value={form.shortDesc} onChange={e => update('shortDesc', e.target.value)} placeholder="Descripción breve para listado" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Descripción completa</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                required
                rows={5}
                placeholder="Descripción detallada del producto..."
                className={cn(inputClass, 'resize-none')}
              />
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h3 className="text-[13px] font-medium text-white">Características</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="Ej: Chip A17 Pro"
                className={cn(inputClass, 'flex-1')}
              />
              <button type="button" onClick={addFeature} className="w-10 h-10 bg-[#c9a84c] text-black rounded-lg flex items-center justify-center hover:bg-[#e0c06e] transition-all flex-shrink-0">
                <Plus size={16} />
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888]">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-[#555] hover:text-red-400 transition-colors ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Images */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h3 className="text-[13px] font-medium text-white">Imágenes (URLs)</h3>
            <p className="text-[11px] text-[#555]">Ingresá las URLs de las imágenes. Para producción, integrar UploadThing.</p>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={e => {
                    const newImgs = [...form.images]
                    newImgs[i] = e.target.value
                    update('images', newImgs)
                  }}
                  placeholder="https://..."
                  className={cn(inputClass, 'flex-1')}
                />
                <button type="button" onClick={() => update('images', form.images.filter((_, idx) => idx !== i))} className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#555] hover:text-red-400 transition-all flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => update('images', [...form.images, ''])} className="text-[11px] text-[#c9a84c] hover:underline flex items-center gap-1">
              <Plus size={11} /> Agregar imagen
            </button>
          </motion.div>

          {/* Toggles */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-3">
            <h3 className="text-[13px] font-medium text-white mb-3">Configuración</h3>
            {[
              { key: 'isActive', label: 'Producto activo', sub: 'Visible en la tienda' },
              { key: 'isFeatured', label: 'Producto destacado', sub: 'Aparece en la home' },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-white">{label}</p>
                  <p className="text-[10px] text-[#555]">{sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => update(key, !(form as any)[key])}
                  className={cn(
                    'relative w-10 h-5 rounded-full transition-all border',
                    (form as any)[key] ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-[#1a1a1a] border-[#2a2a2a]'
                  )}
                >
                  <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all', (form as any)[key] ? 'left-5' : 'left-0.5')} />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <button type="button" onClick={() => router.back()} className="px-5 py-3 text-[12px] text-[#555] border border-[#1e1e1e] rounded-xl hover:border-[#333] hover:text-white transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all disabled:opacity-60"
            >
              <Save size={14} />
              {loading ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
