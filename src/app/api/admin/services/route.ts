import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received service data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.title || !data.description || !data.icon || !Array.isArray(data.features)) {
      console.error('Validation failed:', {
        title: !!data.title,
        description: !!data.description,
        icon: !!data.icon,
        features: Array.isArray(data.features)
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate features array
    if (data.features.length === 0 || data.features.some((f: string) => typeof f !== 'string')) {
      return NextResponse.json(
        { error: 'Features must be an array of non-empty strings' },
        { status: 400 }
      )
    }

    // Create the service
    try {
      const service = await prisma.service.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          icon: data.icon.trim(),
          features: data.features.map((f: string) => f.trim()).filter(Boolean),
        },
      })
      console.log('Service created successfully:', service)
      return NextResponse.json(service, { status: 201 })
    } catch (prismaError) {
      console.error('Prisma error:', prismaError)
      if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        switch (prismaError.code) {
          case 'P2002':
            return NextResponse.json(
              { error: 'A service with this title already exists' },
              { status: 400 }
            )
          default:
            return NextResponse.json(
              { error: `Database error: ${prismaError.message}` },
              { status: 500 }
            )
        }
      }
      throw prismaError // Re-throw if it's not a known Prisma error
    }
  } catch (error) {
    console.error('Error creating service:', error)
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { error: 'Failed to create service. Please try again.' },
      { status: 500 }
    )
  }
} 