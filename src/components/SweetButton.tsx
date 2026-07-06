'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SweetButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export default function SweetButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
}: SweetButtonProps) {
  const baseStyles = 'font-semibold rounded-full px-4 py-2 text-sm transition-all duration-200'
  const variantStyles = {
    primary: 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-soft hover:shadow-glow',
    secondary: 'bg-white text-pink-400 border-2 border-pink-300 shadow-soft hover:bg-pink-50',
  }

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </motion.button>
  )
}
