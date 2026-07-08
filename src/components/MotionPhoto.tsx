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
    const el = videoRef.current
    setPlaying(true)
    if (el.readyState < 2) {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => { el.removeEventListener('canplay', onReady); resolve() }
        const onErr = () => { el.removeEventListener('canplay', onReady); reject() }
        el.addEventListener('canplay', onReady)
        el.addEventListener('error', onErr, { once: true })
      })
    }
    try {
      await el.play()
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
      {/* Video element (always rendered, preloads even when invisible) */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-200 ${playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          controls
          preload="auto"
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Cover image (on top when not playing) */}
      <div
        className={`absolute inset-0 z-20 cursor-pointer ${playing ? 'hidden' : ''}`}
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
            className="absolute top-2 left-2 z-30 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm 
                       flex items-center justify-center text-pink-400 hover:bg-white transition-colors">
            <Expand className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-pink-500">
          <Film className="w-3 h-3" />
          <span>Live</span>
        </div>
      </div>
    </div>
  )
}
