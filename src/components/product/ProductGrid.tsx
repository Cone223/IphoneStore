'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Product } from '@prisma/client'
import { ProductCard } from './ProductCard'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'popular', label: 'Más vistos' },
]

interface Props {
  products: Product[]
  total: number
  page: number
  totalPages: number
  searchParams: Record<string, string | string[] | undefined>
}

export function ProductGrid({ products, total, page, totalPages, searchParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k === key || k === 'page') return
      if (Array.isArray(v)) v.forEach(item => params.append(k, item))
      else if (v) params.set(k, v)
    })
    params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const goToPage = (p: number) => updateParam('page', p.toString())

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mb-4">
          <span className="text-3xl">📱</span>
        </div>
        <h3 className="text-[15px] font-medium text-white mb-2">Sin resultados</h3>
        <p className="text-[13px] text-[#555] max-w-xs">
          No encontramos productos con esos filtros. Probá con otros criterios.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] text-[#555]">
          {total} resultado{total !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#555] hidden sm:block">Ordenar por</span>
          <select
            value={searchParams.sortBy as string || 'newest'}
            onChange={e => updateParam('sortBy', e.target.value)}
            className="bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-1.5 text-[12px] text-[#888] hover:border-[#333] transition-colors outline-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#1e1e1e] text-[#555] hover:text-white hover:border-[#333] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={14} />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={cn(
                  'w-9 h-9 rounded-lg text-[12px] font-medium border transition-all',
                  page === pageNum
                    ? 'bg-[#c9a84c] border-[#c9a84c] text-black'
                    : 'border-[#1e1e1e] text-[#555] hover:text-white hover:border-[#333]'
                )}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#1e1e1e] text-[#555] hover:text-white hover:border-[#333] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
