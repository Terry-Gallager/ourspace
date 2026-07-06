'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'

export interface LightboxItem {
  type: 'image' | 'video'
  src: string
  coverUrl?: string | null
  alt: string
}

interface MediaLightboxProps {
  open: boolean
  items: LightboxItem[]
  initialIndex?: number
  onClose: () => void
}

export default function MediaLightbox({ open, items, initialIndex = 0, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setIndex(initialIndex)
    setPlaying(false)
  }, [initialIndex, open])

  const goNext = useCallback(() => {
    setIndex(i => (i + 1) % items.length)
    setPlaying(false)
  }, [items.length])

  const goPrev = useCallback(() => {
    setIndex(i => (i - 1 + items.length) % items.length)
    setPlaying(false)
  }, [items.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    if (open) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose, goNext, goPrev])

  const item = items[index]
  if (!item) return null

  const isMulti = items.length > 1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {isMulti && (
              <>
                <button onClick={goPrev}
                  className="absolute -left-10 md:-left-14 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 
                             bg-white/20 backdrop-blur-sm flex items-center justify-center text-white
                             hover:bg-white/40 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={goNext}
                  className="absolute -right-10 md:-right-14 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 
                             bg-white/20 backdrop-blur-sm flex items-center justify-center text-white
                             hover:bg-white/40 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs">
                  {index + 1} / {items.length}
                </div>
              </>
            )}

            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt}
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              />
            ) : (
              <div className="relative w-full max-w-[90vw] max-h-[90vh]">
                {!playing ? (
                  <div className="relative flex items-center justify-center">
                    <img
                      src={item.coverUrl || item.src}
                      alt={item.alt}
                      className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                    />
                    <button onClick={() => setPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 text-pink-500 ml-0.5" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <video
                    src={item.src}
                    controls
                    autoPlay
                    playsInline
                    className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                    onEnded={() => setPlaying(false)}
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Close button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm 
                       flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
