import { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { FeaturedProducts } from '@/components/product/FeaturedProducts'
import { PromoSection } from '@/components/layout/PromoSection'
import { CategorySection } from '@/components/layout/CategorySection'
import { NosotrosTeaser } from '@/components/layout/NosotrosTeaser'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/db/prisma'
import { Condition } from '@prisma/client'

export const metadata: Metadata = {
  title: 'iPhoneStore — iPhones Nuevos y Usados con Garantía',
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
}

async function getStats() {
  const [total, newCount, usedCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, condition: Condition.NEW } }),
    prisma.product.count({ where: { isActive: true, condition: { not: Condition.NEW } } }),
  ])
  return { total, newCount, usedCount }
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    getFeaturedProducts(),
    getStats(),
  ])

  return (
    <>
      <HeroSection stats={stats} />
      <CategorySection />
      <FeaturedProducts products={featured} />
      <PromoSection />
      <NosotrosTeaser />
      <Footer />
    </>
  )
}
