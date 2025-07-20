import { Metadata } from 'next'
import { FiTarget, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'About Us - WasteX',
  description: 'Learn about WasteX mission to create cleaner, more sustainable cities through smart waste management.',
}

interface Impact {
  category: string
  items: string[]
}

interface TeamMember {
  title: string
  description: string
  icon: string
}

interface About {
  mission: string
  vision: string
  impact: Impact[]
  team: TeamMember[]
}

async function getAboutData(): Promise<About | null> {
  const about = await prisma.about.findFirst({
    include: {
      impact: true,
      team: true,
    },
  })
  return about
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-0">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">
          About WasteX
        </h1>
        <p className="text-xl text-primary-light max-w-3xl mx-auto">
          Transforming waste management through technology and community engagement
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-background rounded-lg shadow p-6">
          <div className="text-primary mb-4">
            <FiTarget className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-primary-dark mb-2">Our Mission</h3>
          <p className="text-primary-light">
            To create a sustainable future by revolutionizing waste management through innovative technology and community participation.
          </p>
        </div>

        <div className="bg-background rounded-lg shadow p-6">
          <div className="text-primary mb-4">
            <FiAward className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-primary-dark mb-2">Our Vision</h3>
          <p className="text-primary-light">
            To become the leading platform for sustainable waste management, connecting communities with efficient waste collection services.
          </p>
        </div>

        <div className="bg-background rounded-lg shadow p-6">
          <div className="text-primary mb-4">
            <FiUsers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-primary-dark mb-2">Our Values</h3>
          <p className="text-primary-light">
            Sustainability, innovation, and community engagement are at the heart of everything we do.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-background rounded-lg shadow p-8 mb-16">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Our Story</h2>
        <div className="prose max-w-none">
          <p className="text-primary-light mb-4">
            WasteX was founded with a simple yet powerful idea: to make waste management more efficient and accessible for everyone. We recognized the challenges faced by communities in managing their waste effectively and saw an opportunity to leverage technology to create a better solution.
          </p>
          <p className="text-primary-light mb-4">
            Our platform connects waste generators with professional waste collectors, making the process seamless and transparent. Through our innovative approach, we've helped numerous communities improve their waste management practices while promoting environmental sustainability.
          </p>
          <p className="text-primary-light">
            Today, we continue to expand our services and impact, working towards our goal of creating cleaner, more sustainable communities worldwide.
          </p>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-background rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Our Impact</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-primary-light">Communities Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-primary-light">Tons of Waste Managed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-primary-light">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
} 