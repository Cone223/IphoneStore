import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { PaymentMethod, ShippingType } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const {
      paymentMethod,
      shippingType,
      shippingAddress,
      customerName,
      customerPhone,
      items,
      subtotal,
      shippingCost,
      total,
      notes,
    } = body

    // Validate stock for each item
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Stock insuficiente para ${product?.name || item.productId}` },
          { status: 400 }
        )
      }
    }

    // Get product snapshots for order items
    const productSnapshots = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        return { ...item, product }
      })
    )

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session?.user ? (session.user as any).id : 'guest',
          paymentMethod: paymentMethod as PaymentMethod,
          shippingType: shippingType as ShippingType,
          shippingAddress: shippingAddress || null,
          customerName,
          customerPhone: customerPhone || null,
          notes: notes || null,
          subtotal,
          shippingCost: shippingCost || 0,
          total,
          orderItems: {
            create: productSnapshots.map(({ product, quantity, price }) => ({
              productId: product.id,
              quantity,
              price,
              productSnapshot: {
                name: product.name,
                model: product.model,
                storage: product.storage,
                color: product.color,
                condition: product.condition,
                image: product.images[0] || null,
              },
            })),
          },
        },
        include: { orderItems: true },
      })

      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    return NextResponse.json({ success: true, data: order })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear el pedido' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const isAdmin = (session.user as any).role === 'ADMIN'

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
