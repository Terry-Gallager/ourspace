'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface FloatingAddButtonProps {
  onClick: () => void
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full 
                 bg-gradient-to-br from-pink-400 to-pink-500 text-white 
                 shadow-lg shadow-pink-300/50 flex items-center justify-center
                 md:bottom-8 md:right-8"
    >
      <Plus className="w-7 h-7" />
    </motion.button>
  )
}
