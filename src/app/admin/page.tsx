import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { OrderStatus } from '@prisma/client'

export const metadata: Metadata = { title: 'Panel Admin — iPhoneStore' }

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const [
    totalOrders,
    pendingOrders,
    activeProducts,
    revenueData,
    recentOrders,
    allProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED] } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    // All products for the admin products tab
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Calculate totalSold per product from orders
  const orderItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
  })
  const soldMap = Object.fromEntries(orderItems.map(i => [i.productId, i._sum.quantity || 0]))

  const stats = {
    totalOrders,
    pendingOrders,
    activeProducts,
    totalRevenue: Number(revenueData._sum.total || 0),
  }

  const topProducts = allProducts.map(p => ({
    product: p,
    totalSold: soldMap[p.id] || 0,
  }))

  return (
    <AdminDashboard
      stats={stats}
      recentOrders={recentOrders as any}
      topProducts={topProducts}
    />
  )
}
