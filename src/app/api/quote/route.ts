import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Quote from '@/models/Quote'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectDB()

    const quote = await Quote.create(data)
    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Error creating quote' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const quotes = await Quote.find().sort({ createdAt: -1 })
    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Error fetching quotes' },
      { status: 500 }
    )
  }
} 