import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    label: 'iPhone 15 Series',
    sub: 'Pro Max · Pro · Estándar',
    href: '/catalog?model=IPHONE_15_PRO_MAX&model=IPHONE_15_PRO&model=IPHONE_15',
    badge: 'NUEVO',
    badgeColor: 'bg-[#ff3b30]',
    bg: '#f5f5f7',
    emoji: '📱',
  },
  {
    label: 'iPhone 14 Series',
    sub: 'Pro Max · Pro · Plus',
    href: '/catalog?model=IPHONE_14_PRO_MAX&model=IPHONE_14_PRO&model=IPHONE_14',
    badge: null,
    bg: '#eef4fb',
    emoji: '📱',
  },
  {
    label: 'iPhone 13 Series',
    sub: 'Pro · Estándar · Mini',
    href: '/catalog?model=IPHONE_13_PRO_MAX&model=IPHONE_13_PRO&model=IPHONE_13',
    badge: 'POPULAR',
    badgeColor: 'bg-[#0071e3]',
    bg: '#f0f8ef',
    emoji: '📱',
  },
  {
    label: 'Usados certificados',
    sub: 'Como nuevo · Excelente',
    href: '/catalog?condition=LIKE_NEW&condition=EXCELLENT',
    badge: 'AHORRÁ',
    badgeColor: 'bg-[#ff9500]',
    bg: '#fff8ee',
    emoji: '✅',
  },
]

export function CategorySection() {
  return (
    <section className="py-10 bg-white border-b border-[#e8e8ed]">
      <div className="container-store">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[21px] font-bold text-[#1d1d1f] tracking-tight">Explorá por modelo</h2>
          <Link href="/catalog" className="text-[13px] text-[#0071e3] hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group rounded-2xl overflow-hidden border border-[#e8e8ed] p-5 flex flex-col transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]"
              style={{ background: cat.bg }}
            >
              {cat.badge && (
                <span className={`self-start text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded text-white mb-3 ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              )}
              <span className="text-4xl mb-3">{cat.emoji}</span>
              <h3 className="text-[14px] font-bold text-[#1d1d1f] mb-1 group-hover:text-[#0071e3] transition-colors">
                {cat.label}
              </h3>
              <p className="text-[11px] text-[#6e6e73]">{cat.sub}</p>
              <div className="mt-3 text-[11px] text-[#0071e3] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
