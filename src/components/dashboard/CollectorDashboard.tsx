'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Pickup {
  _id: string
  wasteType: string
  quantity: number
  unit: string
  preferredDate: string
  preferredTimeSlot: string
  status: string
  address: {
    street: string
    city: string
  }
  userId: {
    name: string
    phone: string
  }
}

interface LitterReport {
  _id: string
  wasteType: string
  severity: string
  status: string
  location: {
    address: string
    city: string
  }
  reportedBy: {
    name: string
    phone: string
  }
}

export default function CollectorDashboard() {
  const { data: session } = useSession()
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [reports, setReports] = useState<LitterReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pickupsRes, reportsRes] = await Promise.all([
          fetch('/api/waste-pickups?status=in-progress&limit=5'),
          fetch('/api/litter-reports?status=in-progress&limit=5'),
        ])

        if (!pickupsRes.ok || !reportsRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [pickupsData, reportsData] = await Promise.all([
          pickupsRes.json(),
          reportsRes.json(),
        ])

        setPickups(pickupsData.pickups)
        setReports(reportsData.reports)
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
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
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
          Manage your assigned waste pickups and litter reports
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Assigned Pickups */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Active Pickup Requests
            </h2>
            <Link
              href="/pickups"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          {pickups.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No active pickup requests
            </p>
          ) : (
            <div className="space-y-4">
              {pickups.map((pickup) => (
                <div
                  key={pickup._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {pickup.wasteType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {pickup.quantity} {pickup.unit} •{' '}
                        {new Date(pickup.preferredDate).toLocaleDateString()}{' '}
                        {pickup.preferredTimeSlot}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {pickup.address.street}, {pickup.address.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        Contact: {pickup.userId.name} ({pickup.userId.phone})
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Litter Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Active Litter Reports
            </h2>
            <Link
              href="/litter-reports"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </Link>
          </div>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No active litter reports
            </p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {report.wasteType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.location.address}, {report.location.city}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Reported by: {report.reportedBy.name} (
                        {report.reportedBy.phone})
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.severity === 'High'
                            ? 'bg-red-100 text-red-800'
                            : report.severity === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.severity} Severity
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 