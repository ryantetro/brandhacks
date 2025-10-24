import { neon } from '@neondatabase/serverless'
import fs from 'fs/promises'
import path from 'path'

async function migrate() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    console.log('🚀 Starting database migration...')

    // Create tables
    console.log('📋 Creating tables...')
    
    await sql`CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      source VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`
    
    await sql`CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`
    
    console.log('✅ Tables created successfully!')

    // Create indexes
    console.log('🔍 Creating indexes...')
    
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)`
    
    console.log('✅ Indexes created successfully!')

    // Migrate existing data from JSON files
    console.log('📦 Migrating existing data...')
    
    try {
      const waitlistPath = path.join(process.cwd(), 'data', 'waitlist.json')
      const waitlistData = JSON.parse(await fs.readFile(waitlistPath, 'utf-8'))
      
      if (waitlistData.emails && waitlistData.emails.length > 0) {
        for (const email of waitlistData.emails) {
          try {
            await sql`INSERT INTO waitlist (email, source) VALUES (${email}, 'legacy_import') ON CONFLICT (email) DO NOTHING`
          } catch (err) {
            console.log(`⚠️  Skipped duplicate email: ${email}`)
          }
        }
        console.log(`✅ Migrated ${waitlistData.emails.length} waitlist emails!`)
      }
    } catch (err) {
      console.log('ℹ️  No existing waitlist data to migrate')
    }

    try {
      const contactsPath = path.join(process.cwd(), 'data', 'contacts.json')
      const contactsData = JSON.parse(await fs.readFile(contactsPath, 'utf-8'))
      
      if (contactsData.contacts && contactsData.contacts.length > 0) {
        for (const contact of contactsData.contacts) {
          await sql`INSERT INTO contacts (name, email, message, created_at) VALUES (${contact.name}, ${contact.email}, ${contact.message}, ${contact.timestamp || new Date().toISOString()})`
        }
        console.log(`✅ Migrated ${contactsData.contacts.length} contact messages!`)
      }
    } catch (err) {
      console.log('ℹ️  No existing contact data to migrate')
    }

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📊 Database Summary:')
    
    const waitlistCount = await sql`SELECT COUNT(*) as count FROM waitlist`
    const contactsCount = await sql`SELECT COUNT(*) as count FROM contacts`
    
    console.log(`   Waitlist entries: ${waitlistCount.rows[0].count}`)
    console.log(`   Contact messages: ${contactsCount.rows[0].count}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))

