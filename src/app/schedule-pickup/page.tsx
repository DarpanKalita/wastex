import { Metadata } from 'next'
import { FiCalendar, FiClock, FiMapPin, FiTruck } from 'react-icons/fi'
import SchedulePickupForm from '@/components/forms/SchedulePickupForm'

export const metadata: Metadata = {
  title: 'Schedule Pickup - WasteX',
  description: 'Schedule your waste pickup with WasteX - Smart waste management for cleaner cities.',
}

export default function SchedulePickupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Schedule Your Waste Pickup
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <SchedulePickupForm />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Why Choose WasteX?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiClock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  On-Time Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We value your time and ensure prompt service delivery
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTruck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Eco-Friendly
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sustainable waste management practices
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Wide Coverage
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Service available across the city
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 