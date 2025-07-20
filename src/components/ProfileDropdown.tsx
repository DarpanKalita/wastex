'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, LogIn, UserPlus, Shield, LogOut, User } from 'lucide-react';

type MenuItem = {
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  show: boolean;
  type?: 'divider';
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsOpen(false);
  };

  const getButtonStyles = (variant?: 'primary' | 'secondary' | 'danger') => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600';
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600';
      case 'danger':
        return 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20';
      default:
        return 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';
    }
  };

  const menuItems: MenuItem[] = session ? [
    {
      label: 'Dashboard',
      href: session.user?.role === 'admin' ? '/admin' : session.user?.role === 'collector' ? '/collector-dashboard' : '/citizen-dashboard',
      icon: <Shield className="w-4 h-4" />,
      show: true,
      variant: 'secondary'
    },
    {
      label: 'My Profile',
      href: '/profile',
      icon: <User className="w-4 h-4" />,
      show: true,
      variant: 'secondary'
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: <Shield className="w-4 h-4" />,
      show: session.user?.role === 'admin',
      variant: 'secondary'
    },
    {
      type: 'divider',
      show: true
    },
    {
      label: 'Sign Out',
      onClick: handleSignOut,
      icon: <LogOut className="w-4 h-4" />,
      show: true,
      variant: 'danger'
    }
  ] : [
    {
      label: 'Login',
      href: '/login',
      icon: <LogIn className="w-4 h-4" />,
      show: true,
      variant: 'primary'
    },
    {
      label: 'Register',
      href: '/register',
      icon: <UserPlus className="w-4 h-4" />,
      show: true,
      variant: 'secondary'
    },
    {
      type: 'divider',
      show: true
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: <Shield className="w-4 h-4" />,
      show: true,
      variant: 'secondary'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {session ? (
          <>
            <UserCircle className="w-6 h-6" />
            <span className="text-sm font-medium">{session.user?.name}</span>
          </>
        ) : (
          <>
            <UserCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Account</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {menuItems.map((item, index) => {
                if (item.type === 'divider') {
                  return <div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1" />;
                }

                if (!item.show) return null;

                const content = (
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                );

                if (item.href) {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`block px-4 py-2 text-sm ${getButtonStyles(item.variant)}`}
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${getButtonStyles(item.variant)}`}
                    role="menuitem"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown; 