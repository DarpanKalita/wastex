import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CitizenDashboard from '@/components/dashboard/CitizenDashboard'
import CollectorDashboard from '@/components/dashboard/CollectorDashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role === 'admin') {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {session.user?.role === 'citizen' && <CitizenDashboard />}
        {session.user?.role === 'collector' && <CollectorDashboard />}
      </div>
    </div>
  )
} 