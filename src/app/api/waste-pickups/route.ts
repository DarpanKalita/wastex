import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import WastePickup from '@/models/WastePickup'
import { User } from '@/models/User'

// GET all waste pickups (filtered by role)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to view waste pickups' },
        { status: 401 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let query: any = {}

    // Filter based on user role
    switch (user.role) {
      case 'admin':
        // Admins can see all pickups
        if (status) query.status = status
        break
      case 'collector':
        // Collectors can see pickups assigned to them and pending pickups in their area
        query.$or = [
          { assignedTo: user._id },
          {
            status: 'pending',
            'address.city': user.assignedArea?.city,
          },
        ]
        if (status) query.status = status
        break
      case 'citizen':
        // Citizens can only see their own pickups
        query.userId = user._id
        if (status) query.status = status
        break
      default:
        return NextResponse.json(
          { error: 'Invalid user role' },
          { status: 403 }
        )
    }

    const [pickups, total] = await Promise.all([
      WastePickup.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email phone')
        .populate('assignedTo', 'name email phone'),
      WastePickup.countDocuments(query),
    ])

    return NextResponse.json({
      pickups,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching waste pickups:', error)
    return NextResponse.json(
      { error: 'Error fetching waste pickups' },
      { status: 500 }
    )
  }
}

// POST create new waste pickup request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to create a waste pickup request' },
        { status: 401 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User role:', user.role) // Debug log

    if (user.role !== 'citizen') {
      console.log('User is not a citizen:', user) // Debug log
      return NextResponse.json(
        { error: 'Only citizens can create waste pickup requests' },
        { status: 403 }
      )
    }

    const data = await request.json()
    console.log('Received pickup request data:', data)

    // Validate required fields
    const requiredFields = [
      'address',
      'wasteType',
      'quantity',
      'unit',
      'preferredDate',
      'preferredTimeSlot',
    ]
    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate address fields
    const requiredAddressFields = ['street', 'city', 'state', 'pincode']
    const missingAddressFields = requiredAddressFields.filter(field => !data.address[field])
    if (missingAddressFields.length > 0) {
      console.error('Missing required address fields:', missingAddressFields)
      return NextResponse.json(
        { error: `Missing required address fields: ${missingAddressFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create new waste pickup request
    const pickup = await WastePickup.create({
      ...data,
      userId: user._id,
      status: 'pending',
    })

    console.log('Created pickup request:', pickup)

    // Populate user details
    await pickup.populate('userId', 'name email phone')

    return NextResponse.json(pickup, { status: 201 })
  } catch (error) {
    console.error('Error creating waste pickup:', error)
    return NextResponse.json(
      { error: 'Error creating waste pickup request' },
      { status: 500 }
    )
  }
} 