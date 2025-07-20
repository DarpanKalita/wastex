import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Debug log environment variables
console.log('Environment Variables Check:', {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER_EXISTS: !!process.env.SMTP_USER,
  SMTP_PASS_EXISTS: !!process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
})

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true
})

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Configuration Error:', error)
  } else {
    console.log('SMTP Server is ready to take our messages')
  }
})

// Store OTPs temporarily (in production, use Redis or a database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email
async function sendOTP(email: string, otp: string) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
      throw new Error('SMTP configuration is incomplete. Please check your environment variables.')
    }

    console.log('Attempting to send OTP to:', email)
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your WasteX Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">WasteX Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    }

    console.log('Mail options prepared:', { ...mailOptions, html: '***' })
    
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error: any) {
    console.error('Detailed error sending OTP:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      command: error?.command,
      stack: error?.stack,
      response: error?.response,
      responseCode: error?.responseCode
    })
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, action, otp } = body

    console.log('Received request:', { email, action, otp: otp ? '***' : undefined })

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (action === 'generate') {
      const otp = generateOTP()
      const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store OTP
      otpStore.set(email, { otp, expiresAt })
      console.log('OTP stored for:', email)

      try {
        // Send OTP
        await sendOTP(email, otp)
        return NextResponse.json({ message: 'OTP sent successfully' })
      } catch (error: any) {
        console.error('Error in generate action:', error)
        return NextResponse.json(
          { 
            error: 'Failed to send OTP',
            details: error?.message || 'Unknown error occurred'
          },
          { status: 500 }
        )
      }
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json(
          { error: 'OTP is required' },
          { status: 400 }
        )
      }

      console.log('Verifying OTP for:', email)
      const storedData = otpStore.get(email)

      if (!storedData) {
        console.log('No OTP found for:', email)
        return NextResponse.json(
          { error: 'No OTP found for this email. Please request a new OTP.' },
          { status: 400 }
        )
      }

      if (Date.now() > storedData.expiresAt) {
        console.log('OTP expired for:', email)
        otpStore.delete(email)
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new OTP.' },
          { status: 400 }
        )
      }

      if (otp !== storedData.otp) {
        console.log('Invalid OTP for:', email)
        return NextResponse.json(
          { error: 'Invalid OTP. Please check and try again.' },
          { status: 400 }
        )
      }

      console.log('OTP verified successfully for:', email)
      // Clear OTP after successful verification
      otpStore.delete(email)
      return NextResponse.json({ message: 'Email verified successfully' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('OTP API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
} 