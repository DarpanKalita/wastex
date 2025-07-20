import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET() {
  try {
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ status: 'Connected to MongoDB' })
    } else {
      const MONGODB_URI = process.env.MONGODB_URI
      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined')
      }
      await mongoose.connect(MONGODB_URI)
      return NextResponse.json({ status: 'Successfully connected to MongoDB' })
    }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    )
  }
} 