import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'citizen' | 'collector'
    assignedArea?: {
      city: string
      state: string
    }
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'admin' | 'citizen' | 'collector'
      assignedArea?: {
        city: string
        state: string
      }
    }
  }
} 