'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Film, Expand } from 'lucide-react'

interface MotionPhotoProps {
  src: string
  videoUrl?: string | null
  alt: string
  className?: string
  onView?: () => void
}

export default function MotionPhoto({ src, videoUrl, alt, className = '', onView }: MotionPhotoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
  }, [videoUrl])

  const handlePlay = async () => {
    if (!videoUrl || !videoRef.current) return
    setPlaying(true)
    try {
      await videoRef.current.play()
    } catch {
      setPlaying(false)
    }
  }

  const handleEnded = () => {
    setPlaying(false)
  }

  if (!videoUrl) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Cover image (hidden when playing) */}
      <div
        className={`absolute inset-0 z-10 cursor-pointer ${playing ? 'hidden' : ''}`}
        onClick={handlePlay}
      >
        <Image src={src} alt={alt} fill className="object-cover pointer-events-none" />

        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-pink-500 ml-0.5" />
          </div>
        </div>

        {onView && (
          <button onClick={e => { e.stopPropagation(); onView() }}
            className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm 
                       flex items-center justify-center text-pink-400 hover:bg-white transition-colors">
            <Expand className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-500">
          <Film className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>

      {/* Video element (always rendered, hidden when not playing) */}
      <div className={`absolute inset-0 z-20 ${playing ? '' : 'hidden'}`}>
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          controls
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
