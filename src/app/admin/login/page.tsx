'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to Kleefo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Please sign in to continue
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Admin Login"
      >
        <LoginForm
          type="admin"
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
} 