'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PasswordStrengthLevel } from '@/lib/password-utils'

interface PasswordStrengthMeterProps {
  score: number
  label: string
  level: PasswordStrengthLevel
}

export function PasswordStrengthMeter({ score, label, level }: PasswordStrengthMeterProps) {
  const shouldReduceMotion = useReducedMotion()

  const colorMap: Record<PasswordStrengthLevel, string> = {
    weak: 'from-red-500 via-orange-500 to-amber-400',
    medium: 'from-amber-400 via-yellow-400 to-lime-400',
    strong: 'from-emerald-400 via-teal-400 to-blue-400',
  }

  return (
    <div className="mt-4 space-y-2" aria-live="polite">
      <div className="h-2 w-full rounded-full bg-gray-800/70">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[level]}`}
          initial={false}
          animate={{ width: `${score}%` }}
          transition={shouldReduceMotion ? undefined : { duration: 0.45, ease: 'easeOut' }}
        />
      </div>
      <motion.p
        className="text-sm text-gray-300"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.35, ease: 'easeOut' }}
      >
        {label}
      </motion.p>
    </div>
  )
}
