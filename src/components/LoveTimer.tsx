'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const START_DATE = new Date('2026-02-28T00:00:00')

function calcDiff() {
  const now = new Date()
  const diff = now.getTime() - START_DATE.getTime()
  if (diff < 0) return { days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

export default function LoveTimer() {
  const [time, setTime] = useState(calcDiff())

  useEffect(() => {
    const timer = setInterval(() => setTime(calcDiff()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-10"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="inline-block mb-2"
      >
        <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
      </motion.div>
      <p className="text-sm text-pink-300 mb-1">我们已经在一起</p>
      <div className="flex items-baseline justify-center gap-1 text-pink-500">
        <span className="text-4xl md:text-5xl font-extrabold">{time.days}</span>
        <span className="text-sm">天</span>
        <span className="text-2xl md:text-3xl font-bold text-pink-400">{time.hours}</span>
        <span className="text-sm text-pink-400">小时</span>
        <span className="text-2xl md:text-3xl font-bold text-pink-300">{time.minutes}</span>
        <span className="text-sm text-pink-300">分钟</span>
      </div>
    </motion.div>
  )
}
