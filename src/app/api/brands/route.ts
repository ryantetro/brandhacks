import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  defaultWarranty: z.number().positive().optional(),
  defaultReturnPolicy: z.number().positive().optional(),
  isVerified: z.boolean().optional().default(false),
})

const createBrandPolicySchema = z.object({
  brandId: z.string().min(1, "Brand ID is required"),
  type: z.enum(['warranty', 'return', 'price_protection', 'other']),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().positive().optional(),
  conditions: z.string().optional(),
  process: z.string().optional(),
  exclusions: z.string().optional(),
  isActive: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand, policies } = body

    // Create brand
    const brandData = createBrandSchema.parse(brand)
    const createdBrand = await prisma.brand.create({
      data: brandData
    })

    // Create policies if provided
    let createdPolicies = []
    if (policies && Array.isArray(policies)) {
      for (const policyData of policies) {
        const policy = createBrandPolicySchema.parse({
          ...policyData,
          brandId: createdBrand.id
        })
        const createdPolicy = await prisma.brandPolicy.create({
          data: policy
        })
        createdPolicies.push(createdPolicy)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        brand: createdBrand,
        policies: createdPolicies
      },
      message: "Brand and policies created successfully"
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Create brand error:", error)
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
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const verified = searchParams.get("verified")

    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ]
      }),
      ...(verified === 'true' && { isVerified: true })
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          policies: {
            where: { isActive: true },
            orderBy: { type: "asc" }
          }
        }
      }),
      prisma.brand.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Get brands error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
