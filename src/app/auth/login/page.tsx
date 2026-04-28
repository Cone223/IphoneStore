'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error, { style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' } })
      } else {
        toast.success('¡Bienvenido!', { style: { background: '#111', color: '#f5f5f5', border: '1px solid #222' } })
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-serif text-2xl">
            <span className="text-white">iPhone</span>
            <span className="text-[#c9a84c]">Store</span>
          </Link>
          <p className="text-[13px] text-[#555] mt-2">Ingresá a tu cuenta</p>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 pr-10 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#c9a84c]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-black text-[13px] font-medium rounded-xl hover:bg-[#e0c06e] transition-all disabled:opacity-60 mt-2"
            >
              <LogIn size={14} />
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#1a1a1a] text-center">
            <p className="text-[12px] text-[#555]">
              ¿No tenés cuenta?{' '}
              <Link href="/auth/register" className="text-[#c9a84c] hover:underline">
                Registrate
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Demo</p>
          <div className="space-y-1">
            <p className="text-[11px] text-[#888]">Admin: <span className="text-white font-mono">admin@iphonestore.com</span> / <span className="text-white font-mono">admin123456</span></p>
            <p className="text-[11px] text-[#888]">Usuario: <span className="text-white font-mono">usuario@test.com</span> / <span className="text-white font-mono">user123456</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
