'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useLoading } from '@/context/LoadingContext'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    title: '',
    description: '',
    icon: '',
    features: [''],
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setIsLoading: setGlobalLoading } = useLoading()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setGlobalLoading(true)
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleSave = async () => {
    // Validate all fields
    if (!newService.title.trim()) {
      setError('Title is required')
      return
    }
    if (!newService.description.trim()) {
      setError('Description is required')
      return
    }
    if (!newService.icon.trim()) {
      setError('Icon is required')
      return
    }
    if (newService.features.length === 0) {
      setError('At least one feature is required')
      return
    }
    if (newService.features.some(f => !f.trim())) {
      setError('All features must be non-empty')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newService,
          title: newService.title.trim(),
          description: newService.description.trim(),
          icon: newService.icon.trim(),
          features: newService.features.map(f => f.trim()).filter(Boolean)
        }),
      })
      const data = await response.json()
      
      if (response.ok) {
        setNewService({
          title: '',
          description: '',
          icon: '',
          features: [''],
        })
        setSuccess('Service added successfully')
        fetchServices()
      } else {
        setError(data.error || 'Failed to add service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setError('An error occurred while saving the service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFeature = () => {
    setNewService(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }))
  }

  const removeFeature = (index: number) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Services</h1>

      {/* New Service Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newService.title}
              onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon (e.g., FiTruck)
            </label>
            <input
              type="text"
              value={newService.icon}
              onChange={(e) => setNewService(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Features
            </label>
            {newService.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...newService.features]
                    newFeatures[index] = e.target.value
                    setNewService(prev => ({ ...prev, features: newFeatures }))
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              <FiPlus /> Add Feature
            </button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Service'}
          </button>
        </div>
      </div>

      {/* Existing Services */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Services</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                  <ul className="mt-2 space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-500 dark:text-gray-400">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 