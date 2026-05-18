'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Heart, X, LogIn } from 'lucide-react'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const err = await login(email, password)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setEmail('')
      setPassword('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-8 w-full max-w-sm shadow-soft border border-pink-200/50 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-pink-300 hover:text-pink-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                <Heart className="w-10 h-10 text-pink-400 mx-auto" />
              </motion.div>
              <h2 className="text-xl font-bold text-pink-500 mt-2">OurSpace</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to edit</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder:text-pink-200"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder:text-pink-200"
              />

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full cute-button flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <Heart className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
