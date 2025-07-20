import { Metadata } from 'next'
import { FiUsers, FiAward, FiBook, FiMessageSquare } from 'react-icons/fi'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Community - WasteX',
  description: 'Join our community and learn about sustainable waste management practices.',
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pt-0">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-8">
            Join Our Community
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-primary-dark dark:text-primary-light">
                  Community Challenges
                </h2>
              </div>
              <p className="text-primary-light dark:text-primary-dark mb-4">
                Participate in monthly challenges to reduce waste and earn rewards. Track your progress and compete with neighbors!
              </p>
              <button className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                View Challenges
              </button>
            </div>

            <div className="bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-primary-dark dark:text-primary-light">
                  Leaderboard
                </h2>
              </div>
              <p className="text-primary-light dark:text-primary-dark mb-4">
                Check out the top contributors in your area. Earn points for sustainable practices and climb the ranks!
              </p>
              <button className="bg-primary hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                View Leaderboard
              </button>
            </div>
          </div>

          <div className="bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold text-primary-dark dark:text-primary-light mb-6">
              Waste Management Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FiBook className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark dark:text-primary-light mb-2">
                      Recycling Guide
                    </h3>
                    <p className="text-primary-light dark:text-primary-dark">
                      Learn what can and cannot be recycled in your area. Follow our comprehensive guide for proper waste sorting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FiMessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark dark:text-primary-light mb-2">
                      Community Forum
                    </h3>
                    <p className="text-primary-light dark:text-primary-dark">
                      Join discussions with neighbors about waste management, share tips, and get answers to your questions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FiAward className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark dark:text-primary-light mb-2">
                      Best Practices
                    </h3>
                    <p className="text-primary-light dark:text-primary-dark">
                      Discover effective ways to reduce waste at home and in your community. Small changes make a big difference!
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FiUsers className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-dark dark:text-primary-light mb-2">
                      Local Events
                    </h3>
                    <p className="text-primary-light dark:text-primary-dark">
                      Stay updated on upcoming community clean-up events and workshops. Join us in making our city cleaner!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-light dark:bg-primary-dark rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-primary-dark dark:text-primary-light mb-6">
              Get Involved
            </h2>
            <p className="text-primary-light dark:text-primary-dark mb-6">
              Join our community of waste management enthusiasts. Together, we can make a difference in keeping our city clean and sustainable.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Register
              </Link>
              <button className="bg-background hover:bg-primary-light text-primary-dark font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 