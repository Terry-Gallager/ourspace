'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ImageIcon, Film } from 'lucide-react'

interface GalleryAlbumCardProps {
  coverUrl: string
  description: string
  date: string
  itemCount: number
  videoCount: number
  onClick?: () => void
  className?: string
}

export default function GalleryAlbumCard({
  coverUrl,
  description,
  date,
  itemCount,
  videoCount,
  onClick,
  className = ''
}: GalleryAlbumCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white rounded-xl shadow-soft overflow-hidden cursor-pointer 
                  hover:shadow-glow transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {coverUrl ? (
          <Image src={coverUrl} alt={description} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-pink-50">
            <ImageIcon className="w-10 h-10 text-pink-300" />
          </div>
        )}

        {/* Item count badge */}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-500 font-medium flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          {itemCount}
          {videoCount > 0 && (
            <span className="flex items-center gap-0.5 ml-1">
              <Film className="w-3 h-3" />
              {videoCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-[11px] text-pink-300">{date}</p>
        {description && (
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
