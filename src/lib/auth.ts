import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await User.findOne({ email: credentials?.email })
        if (!user) throw new Error('No user found with this email')
        if (!user.isEmailVerified) throw new Error('Please verify your email before logging in')
        const isValid = await bcrypt.compare(credentials!.password, user.password)
        if (!isValid) throw new Error('Invalid password')
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session?.user) (session.user as any).role = (token as any).role
      return session
    },
  },
} 