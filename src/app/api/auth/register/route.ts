import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    await dbConnect()
    console.log('Connected to database')

    const body = await req.json()
    console.log('Received registration request:', { ...body, password: '[REDACTED]' })

    const { name, email, password, phone, role = 'citizen', assignedArea } = body

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password: '[REDACTED]' })
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // Validate role
    if (role && !['citizen', 'collector'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either citizen or collector' },
        { status: 400 }
      )
    }

    // Validate assigned area for collectors
    if (role === 'collector' && (!assignedArea?.city || !assignedArea?.state)) {
      return NextResponse.json(
        { error: 'Collectors must provide assigned city and state' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000) // 24 hours

    // Create user data object
    const userData = {
      name,
      email,
      password: await bcrypt.hash(password, 12), // Hash password before saving
      phone,
      role,
      assignedArea: role === 'collector' ? assignedArea : undefined,
      verificationToken,
      verificationTokenExpiry,
      isEmailVerified: true,
    }

    console.log('Creating user with data:', { ...userData, password: '[REDACTED]' })

    // Create new user
    const user = await User.create(userData)
    console.log('User created successfully:', { id: user._id, email: user.email, role: user.role })

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the following link to verify your email address: ${verificationUrl}`,
        html: `
          <p>Click the following link to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't throw the error, just log it
    }

    // Remove sensitive data from response
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      assignedArea: user.assignedArea,
    }

    return NextResponse.json(
      { 
        message: 'User registered successfully. Please check your email to verify your account.', 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Error creating user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 