'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, ShoppingBag, User, Menu, X, LogOut,
  LayoutDashboard, ChevronDown
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: 'iPhone',
    mega: {
      cols: [
        {
          title: 'Nuevos',
          items: [
            { label: 'iPhone 15 Pro Max', href: '/catalog?model=IPHONE_15_PRO_MAX', badge: 'Nuevo' },
            { label: 'iPhone 15 Pro',     href: '/catalog?model=IPHONE_15_PRO', badge: 'Nuevo' },
            { label: 'iPhone 15',         href: '/catalog?model=IPHONE_15', badge: 'Nuevo' },
            { label: 'iPhone 14 Pro',     href: '/catalog?model=IPHONE_14_PRO' },
            { label: 'iPhone 14',         href: '/catalog?model=IPHONE_14' },
          ],
        },
        {
          title: 'Usados certificados',
          items: [
            { label: 'iPhone 14 Pro Max', href: '/catalog?model=IPHONE_14_PRO_MAX&condition=LIKE_NEW' },
            { label: 'iPhone 14 Pro',     href: '/catalog?model=IPHONE_14_PRO' },
            { label: 'iPhone 13 Pro',     href: '/catalog?model=IPHONE_13_PRO' },
            { label: 'iPhone 13',         href: '/catalog?model=IPHONE_13' },
            { label: 'iPhone 12',         href: '/catalog?model=IPHONE_12' },
            { label: 'Ver todos →',       href: '/catalog' },
          ],
        },
        {
          title: 'Por almacenamiento',
          items: [
            { label: '128 GB', href: '/catalog?storage=GB_128' },
            { label: '256 GB', href: '/catalog?storage=GB_256' },
            { label: '512 GB', href: '/catalog?storage=GB_512' },
            { label: '1 TB',   href: '/catalog?storage=TB_1' },
          ],
        },
      ],
    },
  },
  {
    label: 'Nuevos',
    href: '/catalog?condition=NEW',
    mega: {
      cols: [
        {
          title: 'iPhones Nuevos',
          items: [
            { label: 'iPhone 15 Pro Max', href: '/catalog?model=IPHONE_15_PRO_MAX', badge: 'Nuevo' },
            { label: 'iPhone 15 Pro',     href: '/catalog?model=IPHONE_15_PRO', badge: 'Nuevo' },
            { label: 'iPhone 15',         href: '/catalog?model=IPHONE_15', badge: 'Nuevo' },
            { label: 'iPhone 14 Pro',     href: '/catalog?model=IPHONE_14_PRO' },
            { label: 'iPhone 14',         href: '/catalog?model=IPHONE_14' },
          ],
        },
      ],
    },
  },
  {
    label: 'Usados',
    mega: {
      cols: [
        {
          title: 'Por condición',
          items: [
            { label: 'Como nuevo',   href: '/catalog?condition=LIKE_NEW', badge: '⭐' },
            { label: 'Excelente',    href: '/catalog?condition=EXCELLENT' },
            { label: 'Buen estado',  href: '/catalog?condition=GOOD' },
          ],
        },
        {
          title: 'Por modelo',
          items: [
            { label: 'iPhone 14 Pro Max', href: '/catalog?model=IPHONE_14_PRO_MAX' },
            { label: 'iPhone 14 Pro',     href: '/catalog?model=IPHONE_14_PRO' },
            { label: 'iPhone 13 Pro',     href: '/catalog?model=IPHONE_13_PRO' },
            { label: 'iPhone 12 Pro',     href: '/catalog?model=IPHONE_12_PRO' },
          ],
        },
      ],
    },
  },
  { label: 'Nosotros',  href: '/nosotros' },
  { label: 'Garantía',  href: '/nosotros#garantia' },
]

export function Navbar() {
  const { data: session } = useSession()
  const openCart  = useCartStore(s => s.openCart)
  const cartCount = useCartStore(s => s.totalItems())
  const router    = useRouter()

  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [activeMenu,  setActiveMenu]  = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7] text-center py-2 px-4 text-[12px] text-[#1d1d1f]">
        📦 SAME DAY · Envíos en el día en AMBA ·{' '}
        <Link href="/nosotros" className="text-[#0071e3] hover:underline ml-1">
          Ver más info
        </Link>
      </div>

      {/* ── MAIN NAV ── */}
      <nav
        className="bg-white border-b border-[#d2d2d7] sticky top-0 z-50"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="container-store h-[54px] flex items-center gap-0">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-6">
            <span className="text-[17px] font-bold text-[#1d1d1f] tracking-tight">
              iPhone<span className="text-[#0071e3]">Store</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch flex-1 h-[54px]">
            {NAV_ITEMS.map(item => (
              <div
                key={item.label}
                className="relative flex items-center"
                onMouseEnter={() => item.mega ? setActiveMenu(item.label) : setActiveMenu(null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-3 h-[54px] text-[13px] text-[#1d1d1f] border-b-2 transition-all',
                      activeMenu === item.label
                        ? 'border-[#0071e3] text-[#0071e3]'
                        : 'border-transparent hover:text-[#0071e3]'
                    )}
                  >
                    {item.label}
                    {item.mega && <ChevronDown size={12} className="opacity-50" />}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'flex items-center gap-1 px-3 h-[54px] text-[13px] cursor-default border-b-2 transition-all',
                      activeMenu === item.label
                        ? 'border-[#0071e3] text-[#0071e3]'
                        : 'border-transparent text-[#1d1d1f] hover:text-[#0071e3]'
                    )}
                  >
                    {item.label}
                    {item.mega && <ChevronDown size={12} className="opacity-50" />}
                  </span>
                )}

                {/* Mega menu */}
                <AnimatePresence>
                  {activeMenu === item.label && item.mega && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[54px] left-0 bg-white border border-[#d2d2d7] rounded-b-xl shadow-xl z-50 p-5 flex gap-8 min-w-[280px]"
                    >
                      {item.mega.cols.map(col => (
                        <div key={col.title} className="min-w-[130px]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73] mb-3">
                            {col.title}
                          </p>
                          <ul className="space-y-0.5">
                            {col.items.map(link => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={() => setActiveMenu(null)}
                                  className="flex items-center gap-2 py-1.5 text-[13px] text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                                >
                                  {link.label}
                                  {link.badge && (
                                    <span className="text-[9px] bg-[#ff3b30] text-white px-1.5 py-0.5 rounded font-bold">
                                      {link.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
            >
              <Search size={17} />
            </button>

            {/* Account */}
            {session ? (
              <div className="relative group">
                <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                  <User size={17} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#d2d2d7] rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-3 py-2.5 border-b border-[#f0f0f5]">
                    <p className="text-[12px] font-semibold text-[#1d1d1f] truncate">{session.user?.name}</p>
                    <p className="text-[11px] text-[#6e6e73] truncate">{session.user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
                      <User size={13} /> Mi perfil
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0071e3] hover:bg-[#f5f5f7] transition-colors">
                        <LayoutDashboard size={13} /> Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#6e6e73] hover:text-[#ff3b30] hover:bg-[#f5f5f7] transition-colors"
                    >
                      <LogOut size={13} /> Salir
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:flex items-center gap-1 px-3 h-8 text-[12px] text-[#0071e3] border border-[#d2d2d7] rounded-full hover:bg-[#f5f5f7] transition-colors">
                Ingresar
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0071e3] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors ml-1"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#f0f0f5] bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-0">
                {[
                  { href: '/catalog', label: 'Ver catálogo completo' },
                  { href: '/catalog?condition=NEW', label: 'iPhones Nuevos' },
                  { href: '/catalog?condition=LIKE_NEW&condition=EXCELLENT', label: 'iPhones Usados' },
                  { href: '/nosotros', label: 'Nosotros' },
                  { href: '/wishlist', label: 'Favoritos' },
                  { href: '/profile', label: 'Mi cuenta' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-3 text-[14px] text-[#1d1d1f] border-b border-[#f5f5f7] hover:text-[#0071e3] transition-colors last:border-0"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── SEARCH MODAL ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d2d2d7]"
            >
              <form onSubmit={handleSearch} className="flex items-center px-5 py-4 gap-3">
                <Search size={18} className="text-[#6e6e73] flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar iPhones..."
                  className="flex-1 text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                  <X size={18} />
                </button>
              </form>
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {['iPhone 15 Pro', 'iPhone 14', 'Usados 256GB', 'Con garantía'].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      router.push(`/catalog?search=${encodeURIComponent(q)}`)
                      setSearchOpen(false)
                    }}
                    className="px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] rounded-full hover:bg-[#ebebed] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
