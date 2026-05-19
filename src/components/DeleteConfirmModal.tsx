'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface DeleteConfirmModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function DeleteConfirmModal({
  open,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center 
                     bg-black/30 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl p-8 w-full max-w-sm 
                       shadow-soft border border-pink-200/50"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Heart className="w-12 h-12 text-pink-400 mx-auto" />
            </motion.div>

            <h3 className="text-xl font-bold text-pink-500 text-center mb-2">
              确定要删掉这个珍贵的回忆吗？🥺
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              删除后无法恢复哦
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl border-2 border-pink-200 text-pink-400 
                           font-semibold hover:bg-pink-50 transition-colors"
              >
                再想想
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-red-400 text-white font-semibold 
                           hover:bg-red-500 transition-colors disabled:opacity-50 
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  '狠心删除'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
