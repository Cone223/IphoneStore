import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProductDetail } from '@/components/product/ProductDetail'
import { RelatedProducts } from '@/components/product/RelatedProducts'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.name,
    description: product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product || !product.isActive) notFound()

  // Increment view count
  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  })

  // Related products
  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      model: product.model,
      id: { not: product.id },
    },
    take: 4,
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <ProductDetail product={product} />
      {related.length > 0 && <RelatedProducts products={related} />}
    </div>
  )
}
