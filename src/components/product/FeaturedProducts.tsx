import { Product } from '@prisma/client'
import { ProductCard } from './ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-12 border-t border-[#1a1a1a]">
      <div className="container-store">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl text-white">Productos destacados</h2>
            <p className="text-[13px] text-[#555] mt-1">Lo mejor de nuestro catálogo</p>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-[12px] text-[#c9a84c] hover:underline"
          >
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
