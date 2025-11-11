'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RecommendRibbonProps {
  className?: string
}

export function RecommendRibbon({ className }: RecommendRibbonProps) {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { scale: 0 }}
      animate={shouldReduceMotion ? {} : { scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`absolute top-0 right-0 z-10 ${className || ''}`}
      aria-label="Recommended"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 blur-sm" />
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg shadow-lg">
          <span className="relative z-10">推荐</span>
        </div>
      </div>
    </motion.div>
  )
}

