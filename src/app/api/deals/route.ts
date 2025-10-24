import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createDealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  originalPrice: z.number().positive("Original price must be positive"),
  discountedPrice: z.number().positive("Discounted price must be positive"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  url: z.string().url("Invalid URL"),
  imageUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dealData = createDealSchema.parse(body)

    // Calculate discount percentage
    const discountPercentage = Math.round(
      ((dealData.originalPrice - dealData.discountedPrice) / dealData.originalPrice) * 100
    )

    // For now, we'll use a mock user ID. In a real app, you'd get this from authentication
    const userId = "mock-user-id"

    const deal = await prisma.deal.create({
      data: {
        ...dealData,
        tags: JSON.stringify(dealData.tags || []),
        discountPercentage,
        userId,
        expiresAt: dealData.expiresAt ? new Date(dealData.expiresAt) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: deal,
      message: "Deal created successfully"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create deal error:", error)
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
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ]
      })
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.deal.count({ where })
    ])

    // Parse tags from JSON strings
    const dealsWithParsedTags = deals.map(deal => ({
      ...deal,
      tags: JSON.parse(deal.tags || "[]")
    }))

    return NextResponse.json({
      success: true,
      data: dealsWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Get deals error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
