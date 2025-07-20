import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import LitterReport from '@/models/LitterReport'
import { User } from '@/models/User'

// GET all litter reports (filtered by role)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to view litter reports' },
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
    const severity = searchParams.get('severity')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let query: any = {}

    // Filter based on user role
    switch (user.role) {
      case 'admin':
        // Admins can see all reports
        if (status) query.status = status
        if (severity) query.severity = severity
        if (city) query['location.city'] = city
        break
      case 'collector':
        // Collectors can see reports in their area and assigned to them
        query.$or = [
          { assignedTo: user._id },
          {
            status: { $in: ['pending', 'verified'] },
            'location.city': user.assignedArea?.city,
          },
        ]
        if (status) query.status = status
        if (severity) query.severity = severity
        break
      case 'citizen':
        // Citizens can only see their own reports
        query.reportedBy = user._id
        if (status) query.status = status
        if (severity) query.severity = severity
        break
      default:
        return NextResponse.json(
          { error: 'Invalid user role' },
          { status: 403 }
        )
    }

    const [reports, total] = await Promise.all([
      LitterReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reportedBy', 'name email phone')
        .populate('assignedTo', 'name email phone'),
      LitterReport.countDocuments(query),
    ])

    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching litter reports:', error)
    return NextResponse.json(
      { error: 'Error fetching litter reports' },
      { status: 500 }
    )
  }
}

// POST create new litter report
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to create a litter report' },
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

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'location',
      'description',
      'wasteType',
      'severity',
    ]
    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate description length
    if (data.description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Create new litter report
    const report = await LitterReport.create({
      ...data,
      reportedBy: user._id,
      status: 'pending',
    })

    // Populate user details
    await report.populate('reportedBy', 'name email phone')

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating litter report:', error)
    return NextResponse.json(
      { error: 'Error creating litter report' },
      { status: 500 }
    )
  }
} 