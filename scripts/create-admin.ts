const mongooseAdmin = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Define User Schema
const userSchema = new mongooseAdmin.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(this: any, next: (err?: Error) => void) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Create User model
const User = mongooseAdmin.models.User || mongooseAdmin.model('User', userSchema)

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    await mongooseAdmin.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@kleefo.com' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@kleefo.com',
      password: 'Admin@123', // This will be hashed by the pre-save hook
      role: 'admin',
      isEmailVerified: true, // Since this is an admin user, we'll set it as verified
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
    await mongooseAdmin.disconnect()
  }
}

createAdminUser() 