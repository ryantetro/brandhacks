import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createPurchaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  productName: z.string().min(1, "Product name is required"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  purchaseDate: z.string().datetime(),
  receiptImageUrl: z.string().url().optional(),
  receiptText: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  storeUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const purchaseData = createPurchaseSchema.parse(body)

    // For now, we'll use a mock user ID. In a real app, you'd get this from authentication
    const userId = "mock-user-id"

    const purchase = await prisma.purchase.create({
      data: {
        ...purchaseData,
        tags: JSON.stringify(purchaseData.tags || []),
        purchaseDate: new Date(purchaseData.purchaseDate),
      }
    })

    // After creating purchase, try to find matching brand policies
    const brandPolicies = await prisma.brandPolicy.findMany({
      where: {
        brand: {
          name: {
            contains: purchaseData.brand,
            mode: "insensitive"
          }
        },
        isActive: true
      },
      include: {
        brand: true
      }
    })

    // Create warranties and return policies based on brand policies
    const warranties = []
    const returnPolicies = []

    for (const policy of brandPolicies) {
      if (policy.type === 'warranty' && policy.duration) {
        const warranty = await prisma.warranty.create({
          data: {
            purchaseId: purchase.id,
            brand: purchaseData.brand,
            duration: policy.duration,
            type: 'manufacturer',
            description: policy.description,
            coverage: policy.description,
            exclusions: policy.exclusions || 'See brand policy for details',
            claimProcess: policy.process || 'Contact brand directly',
            expiresAt: new Date(new Date(purchaseData.purchaseDate).getTime() + policy.duration * 24 * 60 * 60 * 1000),
            userId
          }
        })
        warranties.push(warranty)
      }

      if (policy.type === 'return' && policy.duration) {
        const returnPolicy = await prisma.returnPolicy.create({
          data: {
            purchaseId: purchase.id,
            brand: purchaseData.brand,
            duration: policy.duration,
            conditions: policy.conditions || 'Standard return conditions apply',
            process: policy.process || 'Return to store or contact brand',
            refundType: 'full',
            expiresAt: new Date(new Date(purchaseData.purchaseDate).getTime() + policy.duration * 24 * 60 * 60 * 1000),
            userId
          }
        })
        returnPolicies.push(returnPolicy)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        purchase,
        warranties,
        returnPolicies,
        brandPolicies: brandPolicies.length
      },
      message: "Purchase created successfully with brand policies applied"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create purchase error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where = {
      ...(brand && { brand: { contains: brand, mode: "insensitive" as const } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { productName: { contains: search, mode: "insensitive" as const } },
        ]
      })
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          warranties: true,
          returnPolicies: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.purchase.count({ where })
    ])

    // Parse tags from JSON strings
    const purchasesWithParsedTags = purchases.map(purchase => ({
      ...purchase,
      tags: JSON.parse(purchase.tags || "[]")
    }))

    return NextResponse.json({
      success: true,
      data: purchasesWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Get purchases error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
