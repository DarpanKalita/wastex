'use client'
import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode
  className?: string
}

export default function AnimatedSection({ children, ...props }: AnimatedSectionProps) {
  return (
    <motion.div {...props}>{children}</motion.div>
  )
} 