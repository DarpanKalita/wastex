import { Metadata } from 'next'
import CollectorRegistrationForm from '@/components/forms/CollectorRegistrationForm'

export const metadata: Metadata = {
  title: 'Register as Collector - WasteX',
  description: 'Join our waste collection team and help make a difference in your community.',
}

export default function CollectorRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Register as a Collector
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join our waste collection team and help make a difference in your community.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:p-8">
            <CollectorRegistrationForm />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By registering, you agree to our{' '}
              <a href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 