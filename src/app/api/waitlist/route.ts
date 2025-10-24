import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import fs from "fs/promises"
import path from "path"

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional().default("landing_page"),
})

const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.json")

async function getWaitlistData() {
  try {
    const data = await fs.readFile(WAITLIST_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with initial data
    const initialData = { count: 237, emails: [] }
    await fs.mkdir(path.dirname(WAITLIST_FILE), { recursive: true })
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

async function updateWaitlistData(data: any) {
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(data, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const data = await getWaitlistData()
    return NextResponse.json({
      success: true,
      count: data.count
    })
  } catch (error) {
    console.error("Get waitlist count error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = waitlistSchema.parse(body)

    const data = await getWaitlistData()

    // Check if email already exists
    if (data.emails.includes(email)) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist!",
        data: {
          email,
          source,
          count: data.count,
          joinedAt: new Date().toISOString()
        }
      })
    }

    // Add email and increment count
    data.emails.push(email)
    data.count += 1
    await updateWaitlistData(data)

    console.log(`New waitlist signup: ${email} from ${source} - Total: ${data.count}`)

    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist! Check your email for the cheat sheet.",
      data: {
        email,
        source,
        count: data.count,
        joinedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
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