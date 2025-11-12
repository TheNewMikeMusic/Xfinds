'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ProfileForm } from '@/components/dashboard/profile-form'

export default function ProfilePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('editProfile')}</h1>
        <p className="mt-2 text-gray-400">{t('editProfileDesc')}</p>
      </div>

      <ProfileForm />
    </div>
  )
}

