import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const contactData = contactSchema.parse(body)

    // Insert into database
    await sql`INSERT INTO contacts (name, email, message, created_at) VALUES (${contactData.name}, ${contactData.email}, ${contactData.message}, NOW())`

    console.log(`New contact message from: ${contactData.email}`)

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully!"
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC`
    
    return NextResponse.json({ 
      success: true, 
      contacts: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error reading contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load contacts' },
      { status: 500 }
    )
  }
}
