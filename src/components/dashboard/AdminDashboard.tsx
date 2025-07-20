'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface DashboardStats {
  totalPickups: number
  activePickups: number
  totalReports: number
  activeReports: number
  totalCollectors: number
  totalCitizens: number
}

interface RecentActivity {
  type: 'pickup' | 'report'
  id: string
  action: string
  timestamp: string
  details: {
    wasteType: string
    status: string
    location?: string
    user?: string
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would have an API endpoint for dashboard stats
        // For now, we'll simulate the data
        const mockStats: DashboardStats = {
          totalPickups: 156,
          activePickups: 23,
          totalReports: 89,
          activeReports: 12,
          totalCollectors: 15,
          totalCitizens: 342,
        }

        const mockActivity: RecentActivity[] = [
          {
            type: 'pickup',
            id: '1',
            action: 'created',
            timestamp: new Date().toISOString(),
            details: {
              wasteType: 'E-Waste',
              status: 'pending',
              location: '123 Main St, City',
              user: 'John Doe',
            },
          },
          {
            type: 'report',
            id: '2',
            action: 'assigned',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            details: {
              wasteType: 'Plastic',
              status: 'in-progress',
              location: '456 Oak Ave, City',
              user: 'Jane Smith',
            },
          },
          // Add more mock activities as needed
        ]

        setStats(mockStats)
        setRecentActivity(mockActivity)
      } catch (err) {
        setError('Error loading dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session?.user?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          System overview and management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Waste Pickups</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-600">
              {stats?.totalPickups}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.activePickups} active requests
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/pickups"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Manage pickups →
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Litter Reports</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-600">
              {stats?.totalReports}
            </p>
            <p className="text-sm text-gray-500">
              {stats?.activeReports} active reports
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/litter-reports"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Manage reports →
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Users</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-600">
              {stats ? (stats.totalCollectors + stats.totalCitizens) : 0}
            </p>
            <p className="text-sm text-gray-500">
              {stats ? `${stats.totalCollectors} collectors • ${stats.totalCitizens} citizens` : '0 collectors • 0 citizens'}
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/users"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Manage users →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/collectors"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Manage Collectors
          </Link>
          <Link
            href="/admin/areas"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Manage Areas
          </Link>
          <Link
            href="/admin/reports"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            View Reports
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            System Settings
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
            >
              <div
                className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'pickup'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.details.wasteType} {activity.type}{' '}
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.details.location}
                  {activity.details.user && ` • By ${activity.details.user}`}
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 