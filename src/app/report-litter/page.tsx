import { Metadata } from 'next'
import { FiCamera, FiMapPin, FiAlertCircle, FiUpload } from 'react-icons/fi'
import ReportLitterForm from '@/components/forms/ReportLitterForm'

export const metadata: Metadata = {
  title: 'Report Litter - WasteX',
  description: 'Help keep our city clean by reporting litter and illegal dumping spots.',
}

export default function ReportLitterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Report Litter or Illegal Dumping
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <ReportLitterForm />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCamera className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Take Photos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Capture clear images of the issue
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Mark Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pin the exact location on the map
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Submit Report
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll take action within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 