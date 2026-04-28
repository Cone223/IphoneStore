'use client'

import { useWishlistStore } from '@/lib/store/wishlist'
import { useQuery } from '@tanstack/react-query'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const ids = useWishlistStore(s => s.items)

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist-products', ids],
    queryFn: async () => {
      if (ids.length === 0) return []
      const res = await fetch(`/api/products?ids=${ids.join(',')}`)
      const json = await res.json()
      return json.data?.items || []
    },
    enabled: ids.length > 0,
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container-store py-8">
        <h1 className="font-serif text-2xl text-white mb-6 flex items-center gap-2">
          <Heart size={20} className="text-[#c9a84c]" />
          Favoritos ({ids.length})
        </h1>

        {ids.length === 0 ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-16 text-center">
            <Heart size={36} className="text-[#2a2a2a] mx-auto mb-4" />
            <p className="text-[14px] text-white mb-2">Tu lista de favoritos está vacía</p>
            <p className="text-[12px] text-[#555] mb-6">Guardá los productos que te interesan</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-black text-[12px] font-medium rounded-lg hover:bg-[#e0c06e] transition-all"
            >
              Ver catálogo →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: ids.length }).map((_, i) => <ProductCardSkeleton key={i} />)
              : data?.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        )}
      </div>
    </div>
  )
}
