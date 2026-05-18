'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, AlertCircle, CheckCircle } from 'lucide-react'

interface CuteAlertProps {
  open: boolean
  message: string
  type?: 'error' | 'success'
  onClose: () => void
}

export default function CuteAlert({ open, message, type = 'error', onClose }: CuteAlertProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`
              flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-soft backdrop-blur-xl border
              ${type === 'error'
                ? 'bg-red-50/90 border-red-200/50 text-red-500'
                : 'bg-green-50/90 border-green-200/50 text-green-500'
              }
            `}
          >
            {type === 'error' ? (
              <AlertCircle className="w-6 h-6 shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-700">{message}</span>
            <button onClick={onClose} className="ml-2 text-pink-300 hover:text-pink-500">
              <X className="w-4 h-4" />
            </button>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-pink-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
