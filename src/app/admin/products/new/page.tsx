import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { ProductForm } from '@/components/admin/ProductForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nuevo producto — Admin' }

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')
  return <ProductForm mode="create" />
}
