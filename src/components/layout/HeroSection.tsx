'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'

// iPhone SVG for each slide
function PhoneDark({ accent = '#c9a84c' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 180 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id="bd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a3c"/>
          <stop offset="100%" stopColor="#1c1c1e"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="172" height="352" rx="30" fill="url(#bd)"/>
      <rect x="4" y="4" width="172" height="352" rx="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
      <rect x="10" y="12" width="160" height="336" rx="24" fill="#050505"/>
      <rect x="16" y="18" width="148" height="324" rx="20" fill="#060618"/>
      <rect x="62" y="22" width="56" height="18" rx="9" fill="#000"/>
      <circle cx="116" cy="31" r="3.5" fill="#0a0a1e"/>
      <text x="40" y="42" fontFamily="-apple-system" fontSize="9" fill="white" opacity="0.7">9:41</text>
      <circle cx="90" cy="190" r="46" fill={`${accent}12`}/>
      <circle cx="90" cy="190" r="28" fill={`${accent}20`}/>
      <circle cx="90" cy="190" r="14" fill={accent} opacity="0.8"/>
      <rect x="28" y="324" width="124" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
      <rect x="0" y="100" width="4" height="28" rx="2" fill="#2a2a2c"/>
      <rect x="0" y="136" width="4" height="50" rx="2" fill="#2a2a2c"/>
      <rect x="0" y="194" width="4" height="50" rx="2" fill="#2a2a2c"/>
      <rect x="176" y="126" width="4" height="64" rx="2" fill="#2a2a2c"/>
    </svg>
  )
}

function PhoneLight({ color = '#c4d4e0', accent = '#60a5fa' }: { color?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 180 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.18)]">
      <defs>
        <linearGradient id="bl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor="#a0b8c8"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="172" height="352" rx="30" fill="url(#bl)"/>
      <rect x="4" y="4" width="172" height="352" rx="30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
      <rect x="10" y="12" width="160" height="336" rx="24" fill="#050505"/>
      <rect x="16" y="18" width="148" height="324" rx="20" fill="#060618"/>
      <rect x="62" y="22" width="56" height="18" rx="9" fill="#000"/>
      <text x="40" y="42" fontFamily="-apple-system" fontSize="9" fill="white" opacity="0.7">9:41</text>
      <circle cx="90" cy="190" r="46" fill={`${accent}18`}/>
      <circle cx="90" cy="190" r="28" fill={`${accent}28`}/>
      <circle cx="90" cy="190" r="14" fill={accent} opacity="0.85"/>
      <rect x="28" y="324" width="124" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
      <rect x="0" y="100" width="4" height="28" rx="2" fill="rgba(0,0,0,0.15)"/>
      <rect x="0" y="136" width="4" height="50" rx="2" fill="rgba(0,0,0,0.15)"/>
      <rect x="176" y="126" width="4" height="64" rx="2" fill="rgba(0,0,0,0.15)"/>
    </svg>
  )
}

const SLIDES = [
  {
    id: 1,
    bg: 'linear-gradient(130deg, #1c1c1e 0%, #2c2c2e 100%)',
    tag: '● Nuevo · En stock ahora',
    tagColor: '#a1a1a6',
    title: 'iPhone 15\nPro Max',
    titleColor: '#fff',
    sub: 'Titanio · Chip A17 Pro',
    subColor: '#a1a1a6',
    price: '$1.899.000',
    priceColor: '#fff',
    priceOld: '$2.100.000',
    href: '/catalog?model=IPHONE_15_PRO_MAX',
    btnStyle: 'white',
    phone: <PhoneDark accent="#c9a84c" />,
  },
  {
    id: 2,
    bg: 'linear-gradient(130deg, #e8f4fd 0%, #d0e8f8 100%)',
    tag: '✅ Certificados · Garantía 3 meses',
    tagColor: '#0071e3',
    title: 'iPhones usados\nde confianza.',
    titleColor: '#1d1d1f',
    sub: 'Revisados y certificados · Desde',
    subColor: '#6e6e73',
    price: '$699.000',
    priceColor: '#1d1d1f',
    priceOld: '',
    href: '/catalog?condition=LIKE_NEW',
    btnStyle: 'blue',
    phone: <PhoneLight color="#c4d4e0" accent="#60a5fa" />,
  },
  {
    id: 3,
    bg: 'linear-gradient(130deg, #fff8e8 0%, #fff0cc 100%)',
    tag: '🏷️ Oferta especial · Stock limitado',
    tagColor: '#bf8000',
    title: 'iPhone 14 Pro\ncon 20% OFF',
    titleColor: '#1d1d1f',
    sub: 'Usado · Batería 94% · Como nuevo',
    subColor: '#6e6e73',
    price: '$1.099.000',
    priceColor: '#1d1d1f',
    priceOld: '$1.350.000',
    href: '/catalog?model=IPHONE_14_PRO',
    btnStyle: 'blue',
    phone: <PhoneLight color="#d4af6e" accent="#d4af6e" />,
    offerBadge: '-20%',
  },
]

const MARQUEE_ITEMS = [
  '🍎 Tus expertos locales en Apple',
  '⚡ SAME DAY! Envíos en el día en AMBA',
  '🏷️ Descuentos en productos seleccionados',
  '✅ Equipos certificados con garantía real',
  '💳 Pagá en cuotas · Sin interés',
  '📦 Envío a todo el país',
]

const INFO_ITEMS = [
  { emoji: '💳', sub: 'Comprá online', title: 'Medios de Pago' },
  { emoji: '🚚', sub: 'Recibílo en tu casa', title: 'Envíos' },
  { emoji: '📍', sub: 'Consultá nuestro local', title: 'Tiendas' },
  { emoji: '🔧', sub: 'Contactanos', title: 'Soporte Técnico' },
  { emoji: '📲', sub: 'Hablá con nosotros', title: 'WhatsApp' },
]

interface HeroProps {
  stats: { total: number; newCount: number; usedCount: number }
}

export function HeroSection({ stats }: HeroProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const slide = SLIDES[current]

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491112345678'

  return (
    <>
      {/* ── HERO SLIDER ── */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center overflow-hidden"
            style={{ background: slide.bg, minHeight: 480 }}
          >
            {/* LEFT — content */}
            <div className="container-store flex items-center w-full py-14">
              <div className="flex-1 max-w-[520px] pr-8">
                {/* Tag */}
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3"
                  style={{ color: slide.tagColor }}
                >
                  {slide.tag}
                </motion.p>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-[48px] md:text-[56px] font-bold leading-[1.04] tracking-[-1.5px] mb-3 whitespace-pre-line"
                  style={{ color: slide.titleColor }}
                >
                  {slide.title}
                </motion.h1>

                {/* Sub */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="text-[16px] font-light mb-2"
                  style={{ color: slide.subColor }}
                >
                  {slide.sub}
                </motion.p>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="flex items-baseline gap-3 mb-7"
                >
                  <span className="text-[32px] font-bold tracking-tight" style={{ color: slide.priceColor }}>
                    {slide.price}
                  </span>
                  {slide.priceOld && (
                    <span className="text-[16px] line-through" style={{ color: slide.subColor }}>
                      {slide.priceOld}
                    </span>
                  )}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    href={slide.href}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      slide.btnStyle === 'white'
                        ? 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]'
                        : 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                    }`}
                    style={slide.btnStyle === 'white' ? { boxShadow: '0 4px 16px rgba(0,0,0,0.15)' } : { boxShadow: '0 4px 16px rgba(0,113,227,0.35)' }}
                  >
                    Ver modelos →
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('¡Hola! Quiero más info sobre iPhones.')}`}
                    target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium transition-all hover:scale-[1.02] border ${
                      slide.btnStyle === 'white'
                        ? 'border-white/40 text-white hover:bg-white/10'
                        : 'border-[#0071e3]/40 text-[#0071e3] hover:bg-[#0071e3]/8'
                    }`}
                  >
                    <MessageCircle size={15} className="text-[#25d366]" />
                    WhatsApp
                  </a>
                </motion.div>

                {/* Stats (only on first slide) */}
                {slide.id === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="flex gap-8 mt-8 pt-7 border-t border-white/15"
                  >
                    {[
                      { v: `${stats.total}+`, l: 'Equipos' },
                      { v: `${stats.newCount}`, l: 'Nuevos' },
                      { v: `${stats.usedCount}`, l: 'Usados' },
                    ].map(({ v, l }) => (
                      <div key={l}>
                        <p className="text-[22px] font-bold text-white">{v}</p>
                        <p className="text-[11px] text-white/50 uppercase tracking-wider">{l}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* RIGHT — phone */}
              <div className="hidden md:flex flex-1 items-center justify-center pb-0 pt-4">
                <div className="relative w-[180px] lg:w-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`ph-${slide.id}`}
                      initial={{ opacity: 0, y: 24, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -24, scale: 0.93 }}
                      transition={{ duration: 0.45, ease: [0.34, 1.06, 0.64, 1] }}
                    >
                      {slide.phone}
                    </motion.div>
                  </AnimatePresence>
                  {slide.offerBadge && (
                    <div className="absolute -top-3 -right-3 w-14 h-14 bg-[#ff3b30] text-white text-[15px] font-black rounded-full flex items-center justify-center shadow-lg">
                      {slide.offerBadge}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow controls */}
        <button
          onClick={() => { prev(); setPaused(true) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-[#d2d2d7] rounded-full flex items-center justify-center text-[#1d1d1f] shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => { next(); setPaused(true) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-[#d2d2d7] rounded-full flex items-center justify-center text-[#1d1d1f] shadow-md backdrop-blur-sm transition-all"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrent(i); setPaused(true) }}
              className="h-[6px] rounded-full transition-all duration-300"
              style={{
                width: i === current ? 22 : 6,
                background: i === current ? '#0071e3' : 'rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── MARQUEE TICKER ── */}
      <div className="border-y border-[#d2d2d7] bg-white overflow-hidden py-2.5">
        <div className="flex gap-0 marquee-track" style={{ width: 'max-content' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-[12.5px] text-[#1d1d1f] px-8 whitespace-nowrap">{item}</span>
              <span className="text-[#d2d2d7] text-[8px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7]">
        <div className="container-store">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-[#d2d2d7]">
            {INFO_ITEMS.map(({ emoji, sub, title }, i) => (
              <Link
                key={i}
                href="#"
                className="flex flex-col items-center text-center py-5 px-3 hover:bg-[#ebebed] transition-colors group"
              >
                <span className="text-[30px] mb-2">{emoji}</span>
                <span className="text-[10px] text-[#6e6e73] mb-0.5">{sub}</span>
                <span className="text-[12px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">{title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
