import { Metadata } from 'next'
import { FiTruck, FiRefreshCw, FiShield, FiTrendingUp } from 'react-icons/fi'
import { PrismaClient } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Services - WasteX',
  description: 'Explore our comprehensive waste management solutions and services.',
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

const prisma = new PrismaClient()

async function getServices(): Promise<Service[]> {
  const services = await prisma.service.findMany()
  return services as Service[]
}

export default async function ServicesPage() {
  const services = await getServices()

  const iconMap: Record<string, any> = {
    FiTruck,
    FiRefreshCw,
    FiShield,
    FiTrendingUp,
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-dark dark:text-primary-light mb-8">
            Our Services
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || FiTruck

              return (
                <div
                  key={service.id}
                  className="bg-background dark:bg-gray-800 rounded-lg shadow-lg p-8"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-primary-light dark:bg-primary-dark rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary dark:text-primary-light" />
                    </div>
                    <h2 className="text-2xl font-semibold text-primary-dark dark:text-primary-light">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-primary-light dark:text-primary-dark mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-primary dark:bg-primary-light rounded-full"></span>
                        <span className="text-primary-light dark:text-primary-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-16 bg-background dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-primary-dark dark:text-primary-light mb-6">
              Get a Quote
            </h2>
            <p className="text-primary-light dark:text-primary-dark mb-6">
              Ready to improve your waste management? Contact us for a customized quote.
            </p>
            <div className="flex space-x-4">
              <button className="bg-primary dark:bg-primary-light text-background font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                Request Quote
              </button>
              <button className="bg-background dark:bg-gray-700 text-primary-light font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 