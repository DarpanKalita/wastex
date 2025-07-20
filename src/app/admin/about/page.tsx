'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

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

export default function AdminAboutPage() {
  const [about, setAbout] = useState<About>({
    mission: '',
    vision: '',
    impact: [],
    team: []
  })

  const [newImpact, setNewImpact] = useState<Impact>({
    category: '',
    items: ['']
  })

  const [newTeam, setNewTeam] = useState<TeamMember>({
    title: '',
    description: '',
    icon: ''
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/admin/about')
      const data = await response.json()
      setAbout(data)
    } catch (error) {
      console.error('Error fetching about data:', error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(about),
      })
      if (response.ok) {
        alert('About page updated successfully!')
      }
    } catch (error) {
      console.error('Error saving about data:', error)
    }
  }

  const addImpactItem = () => {
    setNewImpact(prev => ({
      ...prev,
      items: [...prev.items, '']
    }))
  }

  const removeImpactItem = (index: number) => {
    setNewImpact(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const addImpact = () => {
    setAbout(prev => ({
      ...prev,
      impact: [...prev.impact, newImpact]
    }))
    setNewImpact({
      category: '',
      items: ['']
    })
  }

  const addTeam = () => {
    setAbout(prev => ({
      ...prev,
      team: [...prev.team, newTeam]
    }))
    setNewTeam({
      title: '',
      description: '',
      icon: ''
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage About Page</h1>

      {/* Mission & Vision */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Mission & Vision</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mission
            </label>
            <textarea
              value={about.mission}
              onChange={(e) => setAbout(prev => ({ ...prev, mission: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vision
            </label>
            <textarea
              value={about.vision}
              onChange={(e) => setAbout(prev => ({ ...prev, vision: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Impact</h2>
        <div className="space-y-4">
          {about.impact.map((impact, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="font-medium mb-2">{impact.category}</h3>
              <ul className="list-disc list-inside">
                {impact.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <input
              type="text"
              placeholder="Category"
              value={newImpact.category}
              onChange={(e) => setNewImpact(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2"
            />
            {newImpact.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Impact item"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...newImpact.items]
                    newItems[index] = e.target.value
                    setNewImpact(prev => ({ ...prev, items: newItems }))
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <button
                  onClick={() => removeImpactItem(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={addImpactItem}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                <FiPlus /> Add Item
              </button>
              <button
                onClick={addImpact}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add Impact Section
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <div className="space-y-4">
          {about.team.map((member, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="font-medium">{member.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.description}</p>
            </div>
          ))}
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <input
              type="text"
              placeholder="Title"
              value={newTeam.title}
              onChange={(e) => setNewTeam(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2"
            />
            <textarea
              placeholder="Description"
              value={newTeam.description}
              onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2"
              rows={3}
            />
            <input
              type="text"
              placeholder="Icon (e.g., FiUsers)"
              value={newTeam.icon}
              onChange={(e) => setNewTeam(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2"
            />
            <button
              onClick={addTeam}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add Team Member
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
} 