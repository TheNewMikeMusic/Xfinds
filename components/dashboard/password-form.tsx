'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export function PasswordForm() {
  const t = useTranslations('dashboard')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const passwordMismatch =
    touched.confirm && confirmPassword && confirmPassword !== newPassword
  const passwordTooShort = touched.new && newPassword && newPassword.length < 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('passwordMismatch') })
      setSaving(false)
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: t('passwordTooShort') })
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: t('passwordUpdated') })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTouched({ current: false, new: false, confirm: false })
      } else {
        setMessage({ type: 'error', text: data.error || t('updateFailed') })
      }
    } catch (err) {
      setMessage({ type: 'error', text: t('updateFailed') })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="glass border-blue-600/30 bg-gray-900/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Lock className="h-5 w-5" />
          {t('changePassword')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {message && (
              <motion.div
                className={`rounded-lg p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/10 text-green-300'
                    : 'bg-red-500/10 text-red-300'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <FloatingInput
              id="currentPassword"
              label={t('currentPassword')}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, current: true }))}
              state="default"
            />
          </div>

          <div>
            <FloatingInput
              id="newPassword"
              label={t('newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, new: true }))}
              state={passwordTooShort ? 'error' : 'default'}
              error={passwordTooShort ? t('passwordTooShort') : ''}
            />
          </div>

          <div>
            <FloatingInput
              id="confirmPassword"
              label={t('confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
              state={passwordMismatch ? 'error' : 'default'}
              error={passwordMismatch ? t('passwordMismatch') : ''}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? t('saving') : t('updatePassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

