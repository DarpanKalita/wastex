'use client'

import { useState, useEffect } from 'react'
import { FiUsers, FiFileText, FiTruck, FiMessageSquare } from 'react-icons/fi'
import { useLoading } from '@/context/LoadingContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Stats {
  totalUsers: number
  usersByRole: { role: string; _count: number }[]
  totalServices: number
  totalQuotes: number
  quotesByStatus: { status: string; _count: number }[]
  totalBlogPosts: number
  recentQuotes: {
    id: string
    status: string
    createdAt: string
    user: {
      name: string
      email: string
    }
  }[]
  // New fields for charts
  userGrowth: { date: string; count: number }[]
  pickupStats: { date: string; count: number }[]
  reportStats: { date: string; count: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const { setIsLoading } = useLoading()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!stats) {
    return null
  }

  const getUsersByRole = (role: string) => {
    return stats.usersByRole.find(r => r.role === role)?._count || 0
  }

  const getQuotesByStatus = (status: string) => {
    return stats.quotesByStatus.find(s => s.status === status)?._count || 0
  }

  // Chart configurations
  const userGrowthData = {
    labels: stats.userGrowth.map(item => item.date),
    datasets: [
      {
        label: 'User Growth',
        data: stats.userGrowth.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const pickupStatsData = {
    labels: stats.pickupStats.map(item => item.date),
    datasets: [
      {
        label: 'Waste Pickups',
        data: stats.pickupStats.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  }

  const userRoleData = {
    labels: ['Citizens', 'Collectors', 'Admins'],
    datasets: [
      {
        data: [
          getUsersByRole('citizen'),
          getUsersByRole('collector'),
          getUsersByRole('admin'),
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Citizens: {getUsersByRole('citizen')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Collectors: {getUsersByRole('collector')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admins: {getUsersByRole('admin')}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FiTruck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quotes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalQuotes}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FiMessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pending: {getQuotesByStatus('pending')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Approved: {getQuotesByStatus('approved')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rejected: {getQuotesByStatus('rejected')}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Posts</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalBlogPosts}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FiFileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h2>
          <div className="h-64">
            <Line
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Waste Pickup Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Waste Pickup Activity</h2>
          <div className="h-64">
            <Bar
              data={pickupStatsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Role Distribution</h2>
          <div className="h-64">
            <Doughnut
              data={userRoleData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentQuotes.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{quote.user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{quote.user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                    quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quote.status}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 