import { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import { Prisma, IPhoneModel, StorageOption, Condition } from '@prisma/client'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CatalogFilters } from '@/components/product/CatalogFilters'

export const metadata: Metadata = {
  title: 'Catálogo de iPhones',
  description: 'Explorá nuestra selección de iPhones nuevos y usados con garantía.',
}

interface CatalogPageProps {
  searchParams: {
    search?: string
    model?: string | string[]
    storage?: string | string[]
    condition?: string | string[]
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
  }
}

function buildWhereClause(searchParams: CatalogPageProps['searchParams']): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
      { color: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.model) {
    const models = Array.isArray(searchParams.model) ? searchParams.model : [searchParams.model]
    where.model = { in: models as IPhoneModel[] }
  }

  if (searchParams.storage) {
    const storages = Array.isArray(searchParams.storage) ? searchParams.storage : [searchParams.storage]
    where.storage = { in: storages as StorageOption[] }
  }

  if (searchParams.condition) {
    const conditionMap: Record<string, Condition[]> = {
      NEW: [Condition.NEW],
      USED: [Condition.LIKE_NEW, Condition.EXCELLENT, Condition.GOOD, Condition.FAIR],
    }
    const raw = Array.isArray(searchParams.condition) ? searchParams.condition[0] : searchParams.condition
    if (conditionMap[raw]) {
      where.condition = { in: conditionMap[raw] }
    } else {
      where.condition = raw as Condition
    }
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice)
  }

  return where
}

function buildOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sortBy) {
    case 'price_asc': return { price: 'asc' }
    case 'price_desc': return { price: 'desc' }
    case 'popular': return { viewCount: 'desc' }
    case 'newest':
    default: return { createdAt: 'desc' }
  }
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const where = buildWhereClause(searchParams)
  const orderBy = buildOrderBy(searchParams.sortBy)

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Price range for filter
  const priceRange = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container-store py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-white mb-1">
            {searchParams.search ? `"${searchParams.search}"` : 'Catálogo de iPhones'}
          </h1>
          <p className="text-[13px] text-[#555]">
            {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CatalogFilters
              searchParams={searchParams}
              priceRange={{
                min: Number(priceRange._min.price) || 0,
                max: Number(priceRange._max.price) || 2000000,
              }}
            />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              total={total}
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
