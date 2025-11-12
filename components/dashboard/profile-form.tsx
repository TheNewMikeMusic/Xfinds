'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { AnimatePresence, motion } from 'framer-motion'

export function ProfileForm() {
  const t = useTranslations('dashboard')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )

  useEffect(() => {
    setLoading(true)
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || '')
          setEmail(data.user.email || '')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: t('profileUpdated') })
      } else {
        setMessage({ type: 'error', text: data.error || t('updateFailed') })
      }
    } catch (err) {
      setMessage({ type: 'error', text: t('updateFailed') })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">{t('loading')}</div>
  }

  return (
    <Card className="glass border-blue-600/30 bg-gray-900/80">
      <CardHeader>
        <CardTitle className="text-white">{t('personalInfo')}</CardTitle>
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
              id="email"
              label={t('email')}
              type="email"
              value={email}
              disabled
              state="default"
            />
            <p className="mt-1 text-xs text-gray-400">{t('emailCannotChange')}</p>
          </div>

          <div>
            <FloatingInput
              id="name"
              label={t('name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              state="default"
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? t('saving') : t('save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

