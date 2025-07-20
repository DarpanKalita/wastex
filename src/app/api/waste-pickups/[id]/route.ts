import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import WastePickup from '@/models/WastePickup'
import { User } from '@/models/User'

// GET single waste pickup
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to view waste pickup details' },
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

    const pickup = await WastePickup.findById(params.id)
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email phone')

    if (!pickup) {
      return NextResponse.json(
        { error: 'Waste pickup request not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this pickup
    if (
      user.role === 'citizen' &&
      pickup.userId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this pickup request' },
        { status: 403 }
      )
    }

    if (
      user.role === 'collector' &&
      pickup.assignedTo?.toString() !== user._id.toString() &&
      pickup.status === 'pending' &&
      pickup.address.city !== user.assignedArea?.city
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this pickup request' },
        { status: 403 }
      )
    }

    return NextResponse.json(pickup)
  } catch (error) {
    console.error('Error fetching waste pickup:', error)
    return NextResponse.json(
      { error: 'Error fetching waste pickup details' },
      { status: 500 }
    )
  }
}

// PUT update waste pickup status/assignment
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to update waste pickup details' },
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

    const pickup = await WastePickup.findById(params.id)

    if (!pickup) {
      return NextResponse.json(
        { error: 'Waste pickup request not found' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const updates: any = {}

    // Handle status updates
    if (data.status) {
      // Validate status transition
      const validTransitions: { [key: string]: string[] } = {
        pending: ['scheduled', 'cancelled'],
        scheduled: ['in-progress', 'cancelled'],
        'in-progress': ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      }

      if (!validTransitions[pickup.status].includes(data.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${pickup.status} to ${data.status}` },
          { status: 400 }
        )
      }

      updates.status = data.status

      // Handle completion
      if (data.status === 'completed') {
        updates.completedAt = new Date()
        // Update collector's stats
        if (pickup.assignedTo) {
          await User.findByIdAndUpdate(pickup.assignedTo, {
            $inc: { totalPickups: 1 },
          })
        }
      }
    }

    // Handle assignment
    if (data.assignedTo) {
      if (user.role !== 'admin' && user.role !== 'collector') {
        return NextResponse.json(
          { error: 'Only admins and collectors can assign pickups' },
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
        collector.assignedArea?.city !== pickup.address.city
      ) {
        return NextResponse.json(
          { error: 'Cannot assign to collector outside your area' },
          { status: 403 }
        )
      }

      updates.assignedTo = data.assignedTo
      if (!updates.status) {
        updates.status = 'scheduled'
      }
    }

    // Update pickup
    const updatedPickup = await WastePickup.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    )
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email phone')

    return NextResponse.json(updatedPickup)
  } catch (error) {
    console.error('Error updating waste pickup:', error)
    return NextResponse.json(
      { error: 'Error updating waste pickup details' },
      { status: 500 }
    )
  }
}

// DELETE cancel waste pickup
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to cancel waste pickup requests' },
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

    const pickup = await WastePickup.findById(params.id)

    if (!pickup) {
      return NextResponse.json(
        { error: 'Waste pickup request not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to cancel
    if (
      user.role === 'citizen' &&
      pickup.userId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: 'You can only cancel your own pickup requests' },
        { status: 403 }
      )
    }

    // Only allow cancellation of pending or scheduled pickups
    if (!['pending', 'scheduled'].includes(pickup.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel pickup that is already in progress or completed' },
        { status: 400 }
      )
    }

    // Update status to cancelled
    pickup.status = 'cancelled'
    await pickup.save()

    return NextResponse.json({
      message: 'Waste pickup request cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling waste pickup:', error)
    return NextResponse.json(
      { error: 'Error cancelling waste pickup request' },
      { status: 500 }
    )
  }
} 