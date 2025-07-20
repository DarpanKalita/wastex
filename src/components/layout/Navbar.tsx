import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white text-xl font-bold">
                WasteX
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  {session.user && session.user.role === 'citizen' && (
                    <>
                      <Link
                        href="/schedule-pickup"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Schedule Pickup
                      </Link>
                      <Link
                        href="/report-litter"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Report Litter
                      </Link>
                    </>
                  )}
                  {session.user && session.user.role === 'collector' && (
                    <>
                      <Link
                        href="/pickup-requests"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Pickup Requests
                      </Link>
                      <Link
                        href="/litter-reports"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Litter Reports
                      </Link>
                    </>
                  )}
                  {session.user && session.user.role === 'admin' && (
                    <>
                      <Link
                        href="/admin"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Admin
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/about"
                    className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    {session.user && session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-100 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                {session.user && session.user.role === 'citizen' && (
                  <>
                    <Link
                      href="/schedule-pickup"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Schedule Pickup
                    </Link>
                    <Link
                      href="/report-litter"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Report Litter
                    </Link>
                  </>
                )}
                {session.user && session.user.role === 'collector' && (
                  <>
                    <Link
                      href="/pickup-requests"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Pickup Requests
                    </Link>
                    <Link
                      href="/litter-reports"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Litter Reports
                    </Link>
                  </>
                )}
                {session.user && session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Contact
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-green-700">
            {session ? (
              <div className="space-y-1">
                <div className="px-4 py-2 text-white text-sm">
                  {session.user && session.user.name}
                </div>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-white hover:text-green-100 px-4 py-2 text-base font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="text-white hover:text-green-100 block px-4 py-2 text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-green-100 block px-4 py-2 text-base font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 