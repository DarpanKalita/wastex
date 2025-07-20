import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  phone?: string
  role: 'admin' | 'citizen' | 'collector'
  assignedArea?: {
    city: string
    state: string
  }
  isEmailVerified: boolean
  verificationToken?: string
  verificationTokenExpiry?: Date
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['admin', 'citizen', 'collector'],
      default: 'citizen',
    },
    assignedArea: {
      city: {
        type: String,
        required: function(this: IUser) {
          return this.role === 'collector';
        },
      },
      state: {
        type: String,
        required: function(this: IUser) {
          return this.role === 'collector';
        },
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Create indexes
userSchema.index({ phone: 1 })
userSchema.index({ role: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema) 