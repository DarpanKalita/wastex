import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const servicePages = await prisma.servicePage.findMany()
    return NextResponse.json(servicePages)
  } catch (error) {
    console.error('Error fetching service pages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const servicePage = await prisma.servicePage.create({
      data,
    })
    return NextResponse.json(servicePage)
  } catch (error) {
    console.error('Error creating service page:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 