import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const contactData = contactSchema.parse(body)

    // Read current contacts
    const fileContents = await fs.readFile(CONTACTS_FILE, 'utf8')
    const data = JSON.parse(fileContents)

    // Add new contact with timestamp
    const newContact = {
      ...contactData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }

    data.contacts.push(newContact)

    // Write back to file
    await fs.writeFile(CONTACTS_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully!",
      contact: newContact
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
    const fileContents = await fs.readFile(CONTACTS_FILE, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json({ 
      success: true, 
      contacts: data.contacts,
      count: data.contacts.length
    })
  } catch (error) {
    console.error('Error reading contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load contacts' },
      { status: 500 }
    )
  }
}

