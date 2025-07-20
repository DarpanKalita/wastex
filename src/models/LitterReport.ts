import mongoose from 'mongoose'

export interface ILitterReport extends mongoose.Document {
  reportedBy: mongoose.Types.ObjectId
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  description: string
  wasteType: 'E-Waste' | 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'Organic' | 'Other'
  severity: 'Low' | 'Medium' | 'High'
  status: 'pending' | 'verified' | 'in-progress' | 'resolved' | 'closed'
  images?: string[]
  assignedTo?: mongoose.Types.ObjectId
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const litterReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['E-Waste', 'Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'Other'],
    },
    severity: {
      type: String,
      required: [true, 'Severity level is required'],
      enum: ['Low', 'Medium', 'High'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'in-progress', 'resolved', 'closed'],
      default: 'pending',
    },
    images: [{
      type: String,
    }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Add indexes for common queries
litterReportSchema.index({ reportedBy: 1, status: 1 })
litterReportSchema.index({ status: 1, severity: 1 })
litterReportSchema.index({ 'location.city': 1, status: 1 })
litterReportSchema.index({ assignedTo: 1, status: 1 })

export default mongoose.models.LitterReport || mongoose.model<ILitterReport>('LitterReport', litterReportSchema) 