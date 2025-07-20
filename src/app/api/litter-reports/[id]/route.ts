import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import LitterReport from '@/models/LitterReport'
import { User } from '@/models/User'

// GET single litter report
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to view litter report details' },
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

    const report = await LitterReport.findById(params.id)
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email phone')

    if (!report) {
      return NextResponse.json(
        { error: 'Litter report not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this report
    if (
      user.role === 'citizen' &&
      report.reportedBy.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this report' },
        { status: 403 }
      )
    }

    if (
      user.role === 'collector' &&
      report.assignedTo?.toString() !== user._id.toString() &&
      !['pending', 'verified'].includes(report.status) &&
      report.location.city !== user.assignedArea?.city
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this report' },
        { status: 403 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error fetching litter report:', error)
    return NextResponse.json(
      { error: 'Error fetching litter report details' },
      { status: 500 }
    )
  }
}

// PUT update litter report status/assignment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to update litter report details' },
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

    const report = await LitterReport.findById(params.id)

    if (!report) {
      return NextResponse.json(
        { error: 'Litter report not found' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const updates: any = {}

    // Handle status updates
    if (data.status) {
      // Validate status transition
      const validTransitions: { [key: string]: string[] } = {
        pending: ['verified', 'closed'],
        verified: ['in-progress', 'closed'],
        'in-progress': ['resolved', 'closed'],
        resolved: ['closed'],
        closed: [],
      }

      if (!validTransitions[report.status].includes(data.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${report.status} to ${data.status}` },
          { status: 400 }
        )
      }

      updates.status = data.status

      // Handle resolution
      if (data.status === 'resolved') {
        updates.resolvedAt = new Date()
      }
    }

    // Handle assignment
    if (data.assignedTo) {
      if (user.role !== 'admin' && user.role !== 'collector') {
        return NextResponse.json(
          { error: 'Only admins and collectors can assign reports' },
          { status: 403 }
        )
      }

      const collector = await User.findOne({
        _id: data.assignedTo,
        role: 'collector',
      })

      if (!collector) {
        return NextResponse.json(
          { error: 'Invalid collector ID' },
          { status: 400 }
        )
      }

      if (
        user.role === 'collector' &&
        collector.assignedArea?.city !== report.location.city
      ) {
        return NextResponse.json(
          { error: 'Cannot assign to collector outside your area' },
          { status: 403 }
        )
      }

      updates.assignedTo = data.assignedTo
      if (!updates.status) {
        updates.status = 'verified'
      }
    }

    // Update report
    const updatedReport = await LitterReport.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    )
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email phone')

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error('Error updating litter report:', error)
    return NextResponse.json(
      { error: 'Error updating litter report details' },
      { status: 500 }
    )
  }
}

// DELETE close litter report
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to close litter reports' },
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

    const report = await LitterReport.findById(params.id)

    if (!report) {
      return NextResponse.json(
        { error: 'Litter report not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to close
    if (
      user.role === 'citizen' &&
      report.reportedBy.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: 'You can only close your own reports' },
        { status: 403 }
      )
    }

    // Only allow closing of pending or verified reports
    if (!['pending', 'verified'].includes(report.status)) {
      return NextResponse.json(
        { error: 'Cannot close report that is already in progress or resolved' },
        { status: 400 }
      )
    }

    // Update status to closed
    report.status = 'closed'
    await report.save()

    return NextResponse.json({
      message: 'Litter report closed successfully',
    })
  } catch (error) {
    console.error('Error closing litter report:', error)
    return NextResponse.json(
      { error: 'Error closing litter report' },
      { status: 500 }
    )
  }
} 