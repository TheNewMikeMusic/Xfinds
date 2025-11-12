'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

export function EmailVerificationBanner() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('dashboard')
  const [show, setShow] = useState(false)
  const [emailVerified, setEmailVerified] = useState(true)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && !data.user.emailVerified) {
          setEmailVerified(false)
          setShow(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleResend = async () => {
    setResending(true)
    try {
      const userRes = await fetch('/api/user')
      const userData = await userRes.json()
      const email = userData.user?.email

      if (!email) {
        alert(t('resendFailed'))
        setResending(false)
        return
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resend-verification',
          email,
        }),
      })

      if (res.ok) {
        alert(t('verificationSent'))
      } else {
        alert(t('resendFailed'))
      }
    } catch (err) {
      alert(t('resendFailed'))
    } finally {
      setResending(false)
    }
  }

  if (emailVerified || !show) {
    return null
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-300">{t('verifyEmail')}</p>
              <p className="text-sm text-yellow-200/80">{t('verifyEmailDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? t('sending') : t('resend')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShow(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

