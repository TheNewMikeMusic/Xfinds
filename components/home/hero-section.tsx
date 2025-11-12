'use client'

import { HeroSearch } from '@/components/search/hero-search'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { HERO_COPY, HERO_FALLBACK_BG, type HeroBackground } from '@/content/hero'
import { useState, useRef } from 'react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [bg, setBg] = useState<HeroBackground>(HERO_COPY.background)
  const [imageError, setImageError] = useState(false)

  // Use props if provided, otherwise use config
  const displayTitle = title ?? HERO_COPY.title
  const displaySubtitle = subtitle ?? HERO_COPY.subtitle
  const headingWords = displayTitle.split(' ')

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

  // CSS class for gradient text to avoid Framer Motion animation conflicts
  // Using CSS class instead of inline styles prevents animation warnings

  // Use fallback if image failed to load, otherwise use configured background
  const currentBg = imageError && bg.kind === 'image' ? HERO_FALLBACK_BG : bg

  return (
    <section className="radial-glow relative overflow-hidden px-4 py-12 sm:py-16 md:py-20">
      {/* Background */}
      {currentBg.kind === 'image' ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={currentBg.src}
            alt={currentBg.alt ?? 'Hero background'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => {
              setImageError(true)
              setBg(HERO_FALLBACK_BG)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-transparent" />
        </div>
      ) : (
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
            background: currentBg.css,
            filter: 'blur(30px)',
          }}
        />
      )}

      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          variants={headingContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl"
        >
          <h1 className="mb-4 text-balance text-3xl font-semibold text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
            {headingWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent inline-block"
                style={{
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                <motion.span
                  variants={wordVariant}
                  className="inline-block"
                >
                  {word}
                </motion.span>
                {index < headingWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <motion.p
            variants={wordVariant}
            className="mx-auto mb-8 max-w-3xl text-pretty text-base text-slate-200 sm:mb-10 sm:text-lg md:mb-12 md:text-xl"
          >
            {displaySubtitle}
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
