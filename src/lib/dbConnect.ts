import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const MONGODB_URI = process.env.MONGODB_URI

let isConnected = false

async function dbConnect() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default dbConnect 