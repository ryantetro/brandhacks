import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedBrands() {
  console.log('🌱 Seeding brand database...')

  // Create popular brands with their policies
  const brands = [
    {
      name: 'Costco',
      slug: 'costco',
      website: 'https://costco.com',
      description: 'Warehouse club retailer known for excellent return policies',
      defaultWarranty: 365,
      defaultReturnPolicy: 999999, // Essentially unlimited
      isVerified: true,
      policies: [
        {
          type: 'return',
          title: 'Lifetime Return Policy',
          description: 'Return most items at any time for a full refund, even without receipt',
          duration: 999999,
          conditions: 'Items must be in sellable condition. Electronics have 90-day return window.',
          process: 'Bring item to any Costco warehouse with membership card',
          exclusions: 'Electronics, jewelry, and some seasonal items'
        }
      ]
    },
    {
      name: 'Apple',
      slug: 'apple',
      website: 'https://apple.com',
      description: 'Technology company known for premium products and customer service',
      defaultWarranty: 365,
      defaultReturnPolicy: 14,
      isVerified: true,
      policies: [
        {
          type: 'warranty',
          title: '1-Year Limited Warranty',
          description: 'Covers manufacturing defects and hardware failures',
          duration: 365,
          conditions: 'Must be purchased from Apple or authorized retailer',
          process: 'Contact Apple Support or visit Apple Store',
          exclusions: 'Accidental damage, liquid damage, cosmetic damage'
        },
        {
          type: 'return',
          title: '14-Day Return Policy',
          description: 'Return most products within 14 days of purchase',
          duration: 14,
          conditions: 'Product must be in original condition with packaging',
          process: 'Return to Apple Store or contact Apple Support',
          exclusions: 'Customized products, opened software'
        },
        {
          type: 'other',
          title: 'Free Charger Replacements',
          description: 'Replace damaged Lightning cables and chargers for free',
          duration: 365,
          conditions: 'Must be genuine Apple product',
          process: 'Visit Apple Store with damaged cable',
          exclusions: 'Third-party cables, intentional damage'
        }
      ]
    },
    {
      name: 'Hoka',
      slug: 'hoka',
      website: 'https://hoka.com',
      description: 'Running shoe brand known for comfort and durability',
      defaultWarranty: 365,
      defaultReturnPolicy: 30,
      isVerified: true,
      policies: [
        {
          type: 'warranty',
          title: '1-Year Wear Warranty',
          description: 'Replace shoes that wear out within one year, even from normal use',
          duration: 365,
          conditions: 'Must be purchased from Hoka or authorized retailer',
          process: 'Contact Hoka customer service with photos',
          exclusions: 'Intentional damage, misuse, or abuse'
        },
        {
          type: 'return',
          title: '30-Day Trial',
          description: 'Return unworn shoes within 30 days',
          duration: 30,
          conditions: 'Shoes must be unworn with original packaging',
          process: 'Return to retailer or contact Hoka directly',
          exclusions: 'Worn shoes, customized products'
        }
      ]
    },
    {
      name: 'REI',
      slug: 'rei',
      website: 'https://rei.com',
      description: 'Outdoor gear retailer with excellent return policies',
      defaultWarranty: 365,
      defaultReturnPolicy: 365,
      isVerified: true,
      policies: [
        {
          type: 'return',
          title: '1-Year Return Policy',
          description: 'Return any item within one year for any reason',
          duration: 365,
          conditions: 'Item must be in sellable condition',
          process: 'Return to any REI store or mail back',
          exclusions: 'Items damaged by misuse or normal wear'
        }
      ]
    },
    {
      name: 'Patagonia',
      slug: 'patagonia',
      website: 'https://patagonia.com',
      description: 'Outdoor clothing company with lifetime warranty',
      defaultWarranty: 999999,
      defaultReturnPolicy: 30,
      isVerified: true,
      policies: [
        {
          type: 'warranty',
          title: 'Ironclad Guarantee',
          description: 'Repair or replace any Patagonia product for its useful life',
          duration: 999999,
          conditions: 'Product must be repairable or replaceable',
          process: 'Submit repair request online or visit store',
          exclusions: 'Items damaged beyond repair'
        }
      ]
    },
    {
      name: 'LL Bean',
      slug: 'll-bean',
      website: 'https://llbean.com',
      description: 'Outdoor retailer with lifetime satisfaction guarantee',
      defaultWarranty: 999999,
      defaultReturnPolicy: 365,
      isVerified: true,
      policies: [
        {
          type: 'return',
          title: 'Lifetime Satisfaction Guarantee',
          description: 'Return any item at any time if not satisfied',
          duration: 999999,
          conditions: 'Must be LL Bean product',
          process: 'Return to store or mail back',
          exclusions: 'Items purchased from third parties'
        }
      ]
    }
  ]

  for (const brandData of brands) {
    const { policies, ...brandInfo } = brandData
    
    const brand = await prisma.brand.upsert({
      where: { slug: brandInfo.slug },
      update: brandInfo,
      create: brandInfo
    })

    console.log(`✅ Created/updated brand: ${brand.name}`)

    // Create policies for this brand
    for (const policyData of policies) {
      await prisma.brandPolicy.create({
        data: {
          ...policyData,
          brandId: brand.id
        }
      })
    }

    console.log(`✅ Created ${policies.length} policies for ${brand.name}`)
  }

  console.log('🎉 Brand database seeded successfully!')
}

async function main() {
  try {
    await seedBrands()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
