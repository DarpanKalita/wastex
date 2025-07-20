import mongoose from 'mongoose'

export interface IWastePickup extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  address: {
    street: string
    city: string
    state: string
    pincode: string
    landmark?: string
  }
  wasteType: 'E-Waste' | 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'Organic' | 'Other'
  quantity: number
  unit: 'kg' | 'pieces'
  preferredDate: Date
  preferredTimeSlot: 'Morning' | 'Afternoon' | 'Evening'
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
  assignedTo?: mongoose.Types.ObjectId
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const wastePickupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
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
      landmark: String,
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['E-Waste', 'Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'Other'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'pieces'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTimeSlot: {
      type: String,
      required: [true, 'Preferred time slot is required'],
      enum: ['Morning', 'Afternoon', 'Evening'],
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Add indexes for common queries
wastePickupSchema.index({ userId: 1, status: 1 })
wastePickupSchema.index({ status: 1, preferredDate: 1 })
wastePickupSchema.index({ assignedTo: 1, status: 1 })

export default mongoose.models.WastePickup || mongoose.model<IWastePickup>('WastePickup', wastePickupSchema) 