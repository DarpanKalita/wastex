"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import ProfileDropdown from './ProfileDropdown';

export default function GreenHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setShowHeader(true); // Only show header at very top
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowHeader(false); // Hide on scroll down
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 w-full flex justify-center py-4 px-2 bg-transparent z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      <nav
        className="w-full max-w-6xl flex items-center justify-between shadow-lg px-6 py-3 backdrop-blur-md rounded-2xl border border-primary/20 animate-gradient-move"
        style={{
          background: 'linear-gradient(90deg, rgba(157,192,139,0.92) 0%, rgba(96,153,102,0.92) 60%, rgba(64,81,59,0.92) 100%)',
          boxShadow: '0 4px 32px 0 rgba(64,81,59,0.10)',
          border: '1.5px solid rgba(157,192,139,0.18)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold text-white tracking-wide">
          WasteX
        </Link>
        {/* Right: Nav */}
        <div className="flex items-center gap-6">
          {/* Services Dropdown */}
          <div className="relative z-50">
            <button
              className="text-white font-medium flex items-center gap-1 focus:outline-none"
              onClick={() => setServicesOpen((v) => !v)}
              onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
            >
              Services
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link href="/services" className="block px-4 py-2 text-green-700 hover:bg-green-50">All Services</Link>
                <Link href="/schedule-pickup" className="block px-4 py-2 text-green-700 hover:bg-green-50">Schedule Pickup</Link>
                <Link href="/report-litter" className="block px-4 py-2 text-green-700 hover:bg-green-50">Report Litter</Link>
              </div>
            )}
          </div>
          <Link href="/about" className="text-white font-medium hover:underline">About Us</Link>
          <ProfileDropdown />
        </div>
      </nav>
    </header>
  );
} 