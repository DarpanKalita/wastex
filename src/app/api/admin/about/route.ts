import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      include: {
        impact: true,
        team: true,
      },
    })

    if (!about) {
      // Create default about page if none exists
      const defaultAbout = await prisma.about.create({
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
        include: {
          impact: true,
          team: true,
        },
      })
      return NextResponse.json(defaultAbout)
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { mission, vision, impact, team } = data

    // Update or create about page
    const about = await prisma.about.upsert({
      where: { id: (await prisma.about.findFirst())?.id || '' },
      create: {
        mission,
        vision,
        impact: {
          create: impact
        },
        team: {
          create: team
        }
      },
      update: {
        mission,
        vision,
        impact: {
          deleteMany: {},
          create: impact
        },
        team: {
          deleteMany: {},
          create: team
        }
      },
      include: {
        impact: true,
        team: true,
      },
    })

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 