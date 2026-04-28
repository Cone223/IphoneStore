import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { Metadata } from 'next'
import { ProfileClient } from '@/components/shared/ProfileClient'

export const metadata: Metadata = { title: 'Mi perfil' }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/profile')

  const userId = (session.user as any).id
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <ProfileClient user={session.user as any} orders={orders as any} />
}
