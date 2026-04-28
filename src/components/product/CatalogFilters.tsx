'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

const MODELS = [
  { value: 'IPHONE_15_PRO_MAX', label: 'iPhone 15 Pro Max' },
  { value: 'IPHONE_15_PRO', label: 'iPhone 15 Pro' },
  { value: 'IPHONE_15', label: 'iPhone 15' },
  { value: 'IPHONE_14_PRO_MAX', label: 'iPhone 14 Pro Max' },
  { value: 'IPHONE_14_PRO', label: 'iPhone 14 Pro' },
  { value: 'IPHONE_14', label: 'iPhone 14' },
  { value: 'IPHONE_13_PRO_MAX', label: 'iPhone 13 Pro Max' },
  { value: 'IPHONE_13_PRO', label: 'iPhone 13 Pro' },
  { value: 'IPHONE_13', label: 'iPhone 13' },
  { value: 'IPHONE_12_PRO_MAX', label: 'iPhone 12 Pro Max' },
  { value: 'IPHONE_12', label: 'iPhone 12' },
  { value: 'IPHONE_11', label: 'iPhone 11' },
]

const STORAGES = [
  { value: 'GB_64', label: '64 GB' },
  { value: 'GB_128', label: '128 GB' },
  { value: 'GB_256', label: '256 GB' },
  { value: 'GB_512', label: '512 GB' },
  { value: 'TB_1', label: '1 TB' },
]

const CONDITIONS = [
  { value: 'NEW', label: 'Nuevo' },
  { value: 'LIKE_NEW', label: 'Como nuevo' },
  { value: 'EXCELLENT', label: 'Excelente' },
  { value: 'GOOD', label: 'Buen estado' },
  { value: 'FAIR', label: 'Aceptable' },
]

interface Props {
  searchParams: Record<string, string | string[] | undefined>
  priceRange: { min: number; max: number }
}

export function CatalogFilters({ searchParams, priceRange }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [maxPrice, setMaxPrice] = useState(
    searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : priceRange.max
  )

  const getActiveValues = (key: string): string[] => {
    const val = searchParams[key]
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }

  const updateFilter = (key: string, value: string, multi = true) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k === 'page') return
      if (Array.isArray(v)) v.forEach(item => params.append(k, item))
      else if (v) params.set(k, v)
    })

    if (multi) {
      const current = params.getAll(key)
      if (current.includes(value)) {
        params.delete(key)
        current.filter(v => v !== value).forEach(v => params.append(key, v))
      } else {
        params.append(key, value)
      }
    } else {
      const current = params.get(key)
      if (current === value) params.delete(key)
      else params.set(key, value)
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilters = ['model', 'storage', 'condition', 'minPrice', 'maxPrice'].some(
    k => searchParams[k]
  )

  return (
    <div className={cn('space-y-6', isPending && 'opacity-60 pointer-events-none')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-white">
          <SlidersHorizontal size={13} className="text-[#c9a84c]" />
          Filtros
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-[11px] text-[#c9a84c] hover:underline">
            Limpiar
          </button>
        )}
      </div>

      {/* Condition */}
      <FilterGroup title="Estado">
        {CONDITIONS.map(c => {
          const active = getActiveValues('condition').includes(c.value)
          return (
            <button
              key={c.value}
              onClick={() => updateFilter('condition', c.value, false)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-all border',
                active
                  ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                  : 'border-transparent text-[#666] hover:text-white hover:bg-white/5'
              )}
            >
              {c.label}
              {active && <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />}
            </button>
          )
        })}
      </FilterGroup>

      {/* Model */}
      <FilterGroup title="Modelo">
        {MODELS.map(m => {
          const active = getActiveValues('model').includes(m.value)
          return (
            <button
              key={m.value}
              onClick={() => updateFilter('model', m.value)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-all border',
                active
                  ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                  : 'border-transparent text-[#666] hover:text-white hover:bg-white/5'
              )}
            >
              {m.label}
              {active && <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />}
            </button>
          )
        })}
      </FilterGroup>

      {/* Storage */}
      <FilterGroup title="Almacenamiento">
        <div className="grid grid-cols-2 gap-1.5">
          {STORAGES.map(s => {
            const active = getActiveValues('storage').includes(s.value)
            return (
              <button
                key={s.value}
                onClick={() => updateFilter('storage', s.value)}
                className={cn(
                  'py-1.5 rounded-lg text-[11px] font-medium border transition-all',
                  active
                    ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                    : 'border-[#1e1e1e] text-[#666] hover:text-white hover:border-[#333]'
                )}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup title="Precio máximo">
        <div className="px-1">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            step={50000}
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            onMouseUp={() => updateFilter('maxPrice', maxPrice.toString(), false)}
            onTouchEnd={() => updateFilter('maxPrice', maxPrice.toString(), false)}
            className="w-full accent-[#c9a84c]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#555]">$0</span>
            <span className="text-[11px] text-[#c9a84c] font-medium">
              ${(maxPrice / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t border-[#1a1a1a] pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-[12px] font-medium text-[#888] uppercase tracking-widest">{title}</span>
        <ChevronDown
          size={13}
          className={cn('text-[#555] transition-transform', !open && '-rotate-90')}
        />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  )
}
