'use client'

import { HeroSearch } from '@/components/search/hero-search'
import { motion, useReducedMotion } from 'framer-motion'

interface HeroSectionProps {
  title: string
  subtitle: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const headingWords = title.split(' ')

  const headingContainer = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: 'easeOut',
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const wordVariant = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="radial-glow relative overflow-hidden px-4 py-20">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.5 }
            : {
                opacity: [0.35, 0.6, 0.45],
                scale: [0.95, 1.05, 0.98],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 14,
                repeat: Infinity,
                repeatType: 'mirror',
              }
        }
        style={{
          background:
            'radial-gradient(circle at 25% 20%, rgba(125,211,252,0.3), transparent 55%), radial-gradient(circle at 70% 10%, rgba(192,132,252,0.3), transparent 60%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.18), transparent 65%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          variants={headingContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl"
        >
          <motion.h1 className="mb-6 text-4xl font-semibold text-white md:text-6xl">
            {headingWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={wordVariant}
                className="bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent"
              >
                {word}
                {index < headingWords.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            variants={wordVariant}
            className="mx-auto mb-12 max-w-3xl text-lg text-slate-200 md:text-xl"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            <HeroSearch />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
