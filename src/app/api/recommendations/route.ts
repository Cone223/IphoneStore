import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { IPhoneModel } from '@prisma/client'

/**
 * Smart recommendation engine (no ML required).
 * Uses: viewed products, same model family, similar price range, same condition category.
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, viewedIds = [], limit = 4 } = await req.json()

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId requerido' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ success: false, data: [] })

    const priceNum = Number(product.price)
    const excludeIds = [productId, ...viewedIds]

    // 1. Same model series (e.g. 15 Pro + 15 Pro Max)
    const modelFamily = getModelFamily(product.model)

    // 2. Same condition category
    const conditionGroup = getConditionGroup(product.condition)

    // Score-based candidates
    const candidates = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: excludeIds },
        OR: [
          { model: { in: modelFamily } },
          { condition: { in: conditionGroup } },
          {
            price: {
              gte: priceNum * 0.7,
              lte: priceNum * 1.3,
            },
          },
        ],
      },
      take: 20,
      orderBy: { viewCount: 'desc' },
    })

    // Score each candidate
    const scored = candidates.map(c => {
      let score = 0
      if (modelFamily.includes(c.model)) score += 3
      if (conditionGroup.includes(c.condition)) score += 2
      const priceDiff = Math.abs(Number(c.price) - priceNum) / priceNum
      if (priceDiff < 0.15) score += 3
      else if (priceDiff < 0.3) score += 1
      if (c.isFeatured) score += 1
      if (c.storage === product.storage) score += 1
      return { product: c, score }
    })

    const recommended = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.product)

    return NextResponse.json({ success: true, data: recommended })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

function getModelFamily(model: IPhoneModel): IPhoneModel[] {
  const families: IPhoneModel[][] = [
    [IPhoneModel.IPHONE_15, IPhoneModel.IPHONE_15_PRO, IPhoneModel.IPHONE_15_PRO_MAX],
    [IPhoneModel.IPHONE_14, IPhoneModel.IPHONE_14_PRO, IPhoneModel.IPHONE_14_PRO_MAX],
    [IPhoneModel.IPHONE_13, IPhoneModel.IPHONE_13_PRO, IPhoneModel.IPHONE_13_PRO_MAX],
    [IPhoneModel.IPHONE_12, IPhoneModel.IPHONE_12_PRO, IPhoneModel.IPHONE_12_PRO_MAX],
    [IPhoneModel.IPHONE_11, IPhoneModel.IPHONE_11_PRO, IPhoneModel.IPHONE_11_PRO_MAX],
  ]
  return families.find(f => f.includes(model)) || [model]
}

function getConditionGroup(condition: string): any[] {
  const groups = {
    new: ['NEW'],
    likeNew: ['LIKE_NEW', 'EXCELLENT'],
    used: ['GOOD', 'FAIR'],
  }
  if (condition === 'NEW') return groups.new
  if (['LIKE_NEW', 'EXCELLENT'].includes(condition)) return groups.likeNew
  return groups.used
}
