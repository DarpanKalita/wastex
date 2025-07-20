const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const services = [
    {
      title: 'Smart Collection',
      description: 'Our AI-powered waste collection system ensures efficient and timely pickups, reducing costs and environmental impact.',
      icon: 'FiTruck',
      features: [
        'Real-time monitoring',
        'Automated scheduling',
        'Route optimization',
        'GPS tracking',
      ],
    },
    {
      title: 'Recycling Solutions',
      description: 'Comprehensive recycling programs for various materials, helping you achieve zero waste goals.',
      icon: 'FiRefreshCw',
      features: [
        'Single-stream recycling',
        'E-waste management',
        'Composting services',
        'Material recovery',
      ],
    },
    {
      title: 'Hazardous Waste',
      description: 'Safe and compliant handling of hazardous materials with proper disposal methods.',
      icon: 'FiShield',
      features: [
        'Chemical waste disposal',
        'Medical waste management',
        'Industrial waste handling',
        'Compliance monitoring',
      ],
    },
    {
      title: 'Waste Analytics',
      description: 'Data-driven insights to optimize waste management and reduce costs.',
      icon: 'FiTrendingUp',
      features: [
        'Waste composition analysis',
        'Cost optimization',
        'Environmental impact tracking',
        'Custom reporting',
      ],
    },
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 