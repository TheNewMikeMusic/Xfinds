'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CategoryGridProps {
  categories: { key: string; name: string }[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: mounted && !shouldReduceMotion ? 0.08 : 0,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: mounted && !shouldReduceMotion ? 0.4 : 0, ease: 'easeOut' },
    },
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            aria-label={category.name}
            className="glass-card relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-lg font-semibold text-white focus-ring"
          >
            <span className="relative block bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {categories.map((category) => (
        <motion.button
          key={category.key}
          variants={cardVariants}
          type="button"
          aria-label={category.name}
          className="glass-card relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-lg font-semibold text-white transition-transform duration-500 will-change-transform focus-ring"
          whileHover={
            mounted && !shouldReduceMotion
              ? {
                  rotateX: -4,
                  rotateY: 4,
                  translateY: -8,
                }
              : undefined
          }
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="relative block bg-gradient-to-r from-sky-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">
            {category.name}
          </span>
          <span className="pointer-events-none absolute inset-x-8 -top-1 h-12 rounded-full bg-gradient-to-r from-sky-300/25 to-violet-300/20 blur-3xl" />
        </motion.button>
      ))}
    </motion.div>
  )
}
