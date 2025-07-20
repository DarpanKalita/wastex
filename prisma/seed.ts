import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  // Create initial services
  const services = [
    {
      title: 'Waste Collection',
      description: 'Professional waste collection services for homes and businesses',
      icon: 'FiTruck',
      features: [
        'Regular scheduled pickups',
        '24/7 emergency service',
        'Environmentally friendly disposal'
      ]
    },
    {
      title: 'Recycling Services',
      description: 'Comprehensive recycling solutions for all types of materials',
      icon: 'FiRefreshCw',
      features: [
        'Paper and cardboard recycling',
        'Plastic and metal recycling',
        'Electronic waste handling'
      ]
    },
    {
      title: 'Hazardous Waste Management',
      description: 'Safe and compliant handling of hazardous materials',
      icon: 'FiAlertTriangle',
      features: [
        'Chemical waste disposal',
        'Medical waste handling',
        'Compliance documentation'
      ]
    }
  ]

  console.log('Seeding services...')
  for (const service of services) {
    await prisma.service.create({
      data: service
    })
  }
  console.log('Seeding completed!')

  // Create blog posts
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'The Future of Waste Management',
        content: 'Full content here...',
        author: 'John Doe',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
        status: 'draft',
        featured: false,
        readTime: 5,
        tags: [],
        likes: [],
        comments: [],
        views: 0,
        slug: 'the-future-of-waste-management',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Sustainable Living Tips',
        content: 'Full content here...',
        author: 'Jane Smith',
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        status: 'draft',
        featured: false,
        readTime: 5,
        tags: [],
        likes: [],
        comments: [],
        views: 0,
        slug: 'sustainable-living-tips',
      },
    }),
  ])

  // Create about page
  await prisma.about.create({
    data: {
      mission: 'At WasteX, we\'re committed to revolutionizing waste management through technology and community engagement. Our mission is to create cleaner, more sustainable cities by making waste management smarter, more efficient, and more accessible to everyone.',
      vision: 'To be the leading force in sustainable waste management solutions, creating a cleaner and greener future for generations to come.',
      impact: {
        create: [
          {
            category: 'Environmental Impact',
            items: [
              'Reduced landfill waste by 40%',
              'Increased recycling rates by 60%',
              'Prevented 1000+ tons of waste from oceans'
            ]
          },
          {
            category: 'Community Impact',
            items: [
              'Engaged 50,000+ community members',
              'Created 200+ local clean-up events',
              'Trained 1000+ waste management volunteers'
            ]
          }
        ]
      },
      team: {
        create: [
          {
            title: 'Smart Solutions',
            description: 'Leveraging technology for efficient waste management',
            icon: 'FiTrendingUp'
          },
          {
            title: 'Community First',
            description: 'Empowering communities to make a difference',
            icon: 'FiUsers'
          },
          {
            title: 'Sustainability',
            description: 'Building a greener future for generations to come',
            icon: 'FiAward'
          }
        ]
      }
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 