'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import MotionPhoto from './MotionPhoto'
import { Heart, Upload } from 'lucide-react'
import { uploadFile } from '@/lib/supabase-api'
import CuteAlert from './CuteAlert'

interface PhotoFrameProps {
  src: string
  alt: string
  caption?: string
  editable?: boolean
  onImageChange?: (url: string) => void
  videoUrl?: string | null
  coverUrl?: string | null
  className?: string
}

export default function PhotoFrame({
  src,
  alt,
  caption = '',
  editable = false,
  onImageChange,
  videoUrl,
  coverUrl,
  className = ''
}: PhotoFrameProps) {
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: '' })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const folder = file.type.startsWith('video/') ? 'videos' : 'images'
      const url = await uploadFile(file, folder)
      onImageChange?.(url)
    } catch (err: any) {
      setAlert({ open: true, message: err.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white p-3 pb-8 rounded-lg shadow-soft transform transition-all duration-300 hover:shadow-glow ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-pink-50">
        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-50">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-pink-400" />
            </motion.div>
            <p className="mt-2 text-sm text-pink-400">Uploading...</p>
          </div>
        ) : videoUrl ? (
          <MotionPhoto src={coverUrl || src} videoUrl={videoUrl} alt={alt} />
        ) : src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-pink-300">
            <Heart className="w-12 h-12" />
          </div>
        )}

        {editable && !uploading && (
          <label className="absolute top-2 right-2 cursor-pointer z-30">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-soft hover:bg-white transition-colors">
              <Upload className="w-4 h-4 text-pink-400" />
            </div>
            <input
              type="file"
              accept="image/*,video/mp4,video/quicktime,.mov"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {caption && (
        <p className="mt-3 text-center font-['Dancing_Script'] text-pink-400 text-sm italic">
          {caption}
        </p>
      )}

      <CuteAlert
        open={alert.open}
        message={alert.message}
        type="error"
        onClose={() => setAlert({ open: false, message: '' })}
      />
    </motion.div>
  )
}
