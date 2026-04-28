import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Editar producto — Admin' }

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) notFound()

  return <ProductForm mode="edit" initialData={product} />
}
