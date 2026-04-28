'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!data.success) {
        toast.error(data.error, { style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' } })
        return
      }

      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      toast.success('¡Cuenta creada exitosamente!', { style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' } })
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-serif text-2xl">
            <span className="text-white">iPhone</span><span className="text-[#c9a84c]">Store</span>
          </Link>
          <p className="text-[13px] text-[#555] mt-2">Creá tu cuenta gratis</p>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">{field.label}</label>
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 pr-10 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all disabled:opacity-60 mt-2"
            >
              <UserPlus size={14} />
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#1a1a1a] text-center">
            <p className="text-[12px] text-[#555]">
              ¿Ya tenés cuenta?{' '}
              <Link href="/auth/login" className="text-[#c9a84c] hover:underline">Ingresá</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
