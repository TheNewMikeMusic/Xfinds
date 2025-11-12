'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PasswordForm } from '@/components/dashboard/password-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('dashboard')
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setEmailVerified(data.user.emailVerified)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('settings')}</h1>
        <p className="mt-2 text-gray-400">{t('settingsDesc')}</p>
      </div>

      <Card className="glass border-blue-600/30 bg-gray-900/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            {t('emailVerification')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">{t('verificationStatus')}</p>
              <p className="text-sm text-gray-400">{t('verificationStatusDesc')}</p>
            </div>
            {emailVerified ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>{t('verified')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <XCircle className="h-5 w-5" />
                <span>{t('notVerified')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PasswordForm />
    </div>
  )
}

