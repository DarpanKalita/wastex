import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  category: 'Solar Panels' | 'Street Lights' | 'Accessories'
  price: number
  stock: number
  image: string
  description: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Solar Panels', 'Street Lights', 'Accessories'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  {
    timestamps: true,
  }
)

// Add indexes for common queries
productSchema.index({ category: 1 })
productSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema) 