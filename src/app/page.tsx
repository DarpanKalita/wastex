'use client'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

const AnimatedSection = dynamic(() => import('@/components/AnimatedSection'), { ssr: false })

const features = [
  {
    title: 'Schedule Waste Pickup',
    description: 'Easily schedule doorstep waste pickups for your home or business with just a few clicks.'
  },
  {
    title: 'Report Littering',
    description: 'Help keep your city clean by reporting littering incidents directly to the authorities.'
  },
  {
    title: 'Track Status',
    description: 'Monitor the status of your pickup requests and litter reports in real time.'
  },
  {
    title: 'Community Engagement',
    description: 'Participate in local clean-up drives and learn about sustainable waste practices.'
  },
]

const testimonials = [
  {
    name: 'Amit Sharma',
    quote: 'WasteX made waste disposal so easy. My neighborhood is cleaner than ever!',
    location: 'Delhi, India',
  },
  {
    name: 'Priya Menon',
    quote: 'Reporting littering is now just a tap away. Great initiative by WasteX!',
    location: 'Bangalore, India',
  },
  {
    name: 'Ravi Patel',
    quote: 'I love tracking my pickup requests and being part of community clean-ups.',
    location: 'Ahmedabad, India',
  },
]

const slideshowImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // clean city with greenery
]

export default function Home() {
  const [bgIndex, setBgIndex] = useState(0);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background dark:bg-primary-dark">
      {/* Hero section */}
      <div className="relative z-10 mt-0.5">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-background dark:bg-primary-dark" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Green sustainable city park"
              />
              {/* Radial gradient overlay for depth */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/60 via-primary-dark/70 to-primary-dark/90 opacity-80 mix-blend-multiply pointer-events-none" />
              {/* Floating SVG leaf icon for visual interest */}
              <svg className="absolute left-[-60px] top-1/4 w-72 h-72 opacity-20 z-0 animate-float hidden md:block" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 10C140 10 190 60 190 100C190 140 140 190 100 190C60 190 10 140 10 100C10 60 60 10 100 10Z" fill="#9DC08B"/>
                <path d="M100 40C120 40 160 80 160 100C160 120 120 160 100 160C80 160 40 120 40 100C40 80 80 40 100 40Z" fill="#609966"/>
              </svg>
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <AnimatedSection
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="block text-background drop-shadow-lg" style={{textShadow:'0 4px 24px rgba(64,81,59,0.5)'}}>
                  Cleaner Cities, <span className="relative inline-block">
                    <span className="z-10 relative">Greener</span>
                    <span className="absolute left-0 right-0 bottom-0 h-2 bg-primary-light rounded-full z-0 opacity-60"></span>
                  </span> Future
                </span>
              </AnimatedSection>
              <AnimatedSection
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mt-6 max-w-lg mx-auto text-center text-xl text-primary-light sm:max-w-3xl"
              >
                WasteX is your all-in-one platform for efficient waste management. Schedule pickups, report litter, and join the movement for a cleaner environment.
              </AnimatedSection>
              <AnimatedSection
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center"
              >
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    href="/schedule-pickup"
                    className="flex items-center justify-center px-8 py-4 border border-primary/30 text-lg font-bold rounded-xl shadow-lg text-primary-dark bg-background/70 backdrop-blur-md hover:bg-background/90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 animate-fade-in animate-pulse"
                  >
                    Schedule Pickup
                    <FiArrowRight className="ml-3 text-2xl animate-bounce-x" />
                  </Link>
                  <Link
                    href="/report-litter"
                    className="flex items-center justify-center px-8 py-4 border border-primary-dark/40 text-lg font-bold rounded-xl shadow-lg text-background bg-primary/80 backdrop-blur-md hover:bg-primary-dark/90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 animate-fade-in"
                  >
                    Report Litter
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Features section */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:text-center"
          >
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Why Choose WasteX?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Smart Waste Management for Everyone
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              WasteX empowers citizens and authorities to keep cities clean, sustainable, and healthy.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="bg-background dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center"
              >
                <div className="mb-3 text-primary-600 dark:text-primary-400 text-3xl font-bold">{feature.title}</div>
                <div className="text-gray-600 dark:text-gray-300">{feature.description}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Combined Donate & Testimonials section */}
      <section className="relative overflow-hidden py-16">
        {/* Slideshow background images */}
        <div className="absolute inset-0 w-full h-full z-0">
          {slideshowImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="Background"
              fill
              priority={i === 0}
              className={`object-cover object-center pointer-events-none transition-opacity duration-1000 ${bgIndex === i ? 'opacity-70' : 'opacity-0'}`}
              style={{ transition: 'opacity 1000ms linear' }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-primary-dark/20 z-0" />
        <div className="relative z-10">
          {/* Donate (Support Our Mission) content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl shadow-xl p-10 flex flex-col items-center text-center border border-primary-light bg-background/80 backdrop-blur mb-16"
            >
              <div className="mb-4 animate-bounce">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 7v9m-7-7h14" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-primary-dark mb-2">Support Our Mission</h2>
              <p className="text-lg text-primary-light mb-6">Your donation helps us keep cities cleaner and greener. Every contribution makes a difference in building a sustainable future with WasteX.</p>
              <Link
                href="/donate"
                className="inline-flex items-center px-8 py-3 text-lg font-bold rounded-lg shadow border border-primary/30 text-primary-dark bg-background/80 backdrop-blur-md hover:bg-background/90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 animate-fade-in"
              >
                Donate Now
              </Link>
            </AnimatedSection>
          </div>
          {/* Testimonials content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:text-center"
            >
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary-dark sm:text-4xl">
                What Our Users Say
              </p>
            </AnimatedSection>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <AnimatedSection
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                  className="bg-background/80 backdrop-blur rounded-lg shadow p-6 flex flex-col items-center text-center"
                >
                  <div className="text-primary text-2xl mb-3">"</div>
                  <div className="text-primary-light italic mb-4">{t.quote}</div>
                  <div className="font-semibold text-primary-dark">{t.name}</div>
                  <div className="text-sm text-primary-light">{t.location}</div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Engagement section */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:text-center"
          >
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Get Involved</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Join the WasteX Community
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Participate in local clean-up drives, educational workshops, and sustainability campaigns. Together, we can make a difference!
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Contact Us <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
