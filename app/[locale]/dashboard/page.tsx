'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { User, Mail, Calendar } from 'lucide-react'

interface UserData {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  createdAt: string
}

export default function DashboardPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('dashboard')
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-gray-400">{t('loading')}</div>
  }

  if (!user) {
    return <div className="text-red-400">{t('loadError')}</div>
  }

  const createdDate = new Date(user.createdAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-blue-600/30 bg-gray-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              {t('profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-400">{t('name')}</p>
              <p className="text-white">{user.name || t('notSet')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('email')}</p>
              <p className="text-white">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-600/30 bg-gray-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              {t('verification')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={user.emailVerified ? 'text-green-400' : 'text-yellow-400'}>
                {user.emailVerified ? t('verified') : t('notVerified')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-600/30 bg-gray-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              {t('accountInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-400">{t('memberSince')}</p>
              <p className="text-white">{createdDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

