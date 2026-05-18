'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CuteCardProps {
  children: ReactNode
  className?: string
}

export default function CuteCard({ children, className = '' }: CuteCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white/70 backdrop-blur-lg border border-pink-200/50 rounded-[1.5rem] shadow-soft p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
