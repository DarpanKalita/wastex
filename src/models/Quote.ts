import mongoose from 'mongoose'

export interface IQuote extends mongoose.Document {
  name: string
  email: string
  serviceType: string
  message: string
  status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

const quoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

// Add indexes for common queries
quoteSchema.index({ status: 1 })
quoteSchema.index({ createdAt: -1 })

export default mongoose.models.Quote || mongoose.model<IQuote>('Quote', quoteSchema) 