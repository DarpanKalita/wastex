const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017/wastex'
const client = new MongoClient(uri)

async function seedServicePage() {
  try {
    await client.connect()
    const db = client.db('wastex')
    const collection = db.collection('ServicePage')

    const servicePage = {
      title: 'Sample Service Page',
      description: 'This is a sample service page description.',
      icon: 'FiTruck',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(servicePage)
    console.log('Service page seeded:', result)
  } catch (error) {
    console.error('Error seeding service page:', error)
  } finally {
    await client.close()
  }
}

seedServicePage() 