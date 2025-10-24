import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional().default("landing_page"),
})

export async function GET(request: NextRequest) {
  try {
    // Get total count from database
    const result = await sql`SELECT COUNT(*) as count FROM waitlist`
    
    // Add base count of 237 to make it look like we already have signups
    const totalCount = parseInt(result.rows[0].count) + 237
    
    return NextResponse.json({
      success: true,
      count: totalCount
    })
  } catch (error) {
    console.error("Get waitlist count error:", error)
    // Return default count if database isn't set up yet
    return NextResponse.json({
      success: true,
      count: 237
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = waitlistSchema.parse(body)

    // Try to insert, if duplicate email, it will fail gracefully
    try {
      await sql`INSERT INTO waitlist (email, source, created_at) VALUES (${email}, ${source}, NOW())`
      
      console.log(`New waitlist signup: ${email} from ${source}`)
    } catch (dbError: any) {
      // Check if it's a duplicate key error (email already exists)
      if (dbError?.code === '23505') {
        // Get current count
        const result = await sql`SELECT COUNT(*) as count FROM waitlist`
        const totalCount = parseInt(result.rows[0].count) + 237
        
        return NextResponse.json({
          success: true,
          message: "You're already on the waitlist!",
          count: totalCount
        })
      }
      throw dbError
    }

    // Get updated count
    const result = await sql`SELECT COUNT(*) as count FROM waitlist`
    const totalCount = parseInt(result.rows[0].count) + 237

    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist! Check your email for next steps.",
      count: totalCount
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Waitlist signup error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
