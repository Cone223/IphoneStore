import { Product } from '@prisma/client'
import { ProductCard } from './ProductCard'

interface Props {
  products: Product[]
}

export function RelatedProducts({ products }: Props) {
  return (
    <section className="border-t border-[#1a1a1a] py-10">
      <div className="container-store">
        <h2 className="font-serif text-xl text-white mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
