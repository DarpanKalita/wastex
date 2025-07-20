import mongoose from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as path from 'path'
import { config } from 'dotenv'
import { User } from '../models/User'

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@kleefo.com' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@kleefo.com',
      password: 'Admin@123', // Will be hashed by pre-save hook
      phone: '1234567890', // Required field
      role: 'admin',
      isEmailVerified: true, // Admin is pre-verified
    })

    await adminUser.save()
    console.log('Admin user created successfully')
    console.log('Email:', adminUser.email)
    console.log('Password: Admin@123')
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

createAdminUser() 