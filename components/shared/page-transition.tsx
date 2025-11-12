'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  const transition = shouldReduceMotion
    ? undefined
    : {
        duration: 0.2,
        ease: 'easeOut' as const,
      }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
        transition={transition}
        className="min-h-screen page-transition-container"
        style={{
          willChange: shouldReduceMotion ? 'auto' : 'opacity',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
